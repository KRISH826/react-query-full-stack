import OpenAI from "openai";
import { AssistantResponse, ParsedIntent } from "../../models/assistant";
import { config } from "../../config/config";
import { AssistantUserGender, getAiAssistantPrompt } from "./assistant.prompt";
import { AssistantProductQuery } from "./assistant.repository";

type ProductGender = "MALE" | "FEMALE" | "UNISEX" | null;

const normalizeGenderForSearch = (gender: string | null | undefined): ProductGender => {
    switch (gender?.toLowerCase()) {
        case "male":
            return "MALE";
        case "female":
            return "FEMALE";
        case "unisex":
            return "UNISEX";
        default:
            return null;
    }
};

export class AssistantService {
    static async getAssistantResponse(userMessage: string, page: number = 1, limit: number = 10,
        extraFilters?: { brands?: string[]; categories?: string[]; sizes?: string[], },
        userGender?: AssistantUserGender
    ): Promise<AssistantResponse> {
        const parsedResult = await this.parsedWithDeepSeek(userMessage, userGender);
        // ✅ Always override gender with actual user gender
        const resolvedGender = userGender && userGender !== "Unisex"
            ? userGender
            : parsedResult.intent.gender;
        parsedResult.intent.gender = normalizeGenderForSearch(resolvedGender);
        const searchFilters = {
            max_price: parsedResult.filters.max_price ?? undefined,
            brands: parsedResult.filters.brands?.length ? parsedResult.filters.brands : extraFilters?.brands,
            categories: parsedResult.filters.categories?.length ? parsedResult.filters.categories : extraFilters?.categories,
            sizes: extraFilters?.sizes,
        };

        const searchResults = await AssistantProductQuery(
            parsedResult.intent,   // ParsedIntentSearch directly
            searchFilters,
            page,
            limit
        );

        return {
            success: true,
            message: parsedResult.message,
            products: searchResults.data,
            page: searchResults.page,
            totalPages: searchResults.totalPages,
            intent: parsedResult,
        };
    }

    private static async parsedWithDeepSeek(message: string, userGender: AssistantUserGender = null): Promise<ParsedIntent> {
        try {
            const openAi = new OpenAI({
                baseURL: config.deepseek.api_url,
                apiKey: config.deepseek.api_key,
                timeout: 10000,
            })

            const response = await openAi.chat.completions.create({
                model: "deepseek-v4-flash",
                messages: [
                    { role: "system", content: getAiAssistantPrompt(userGender) },
                    { role: "user", content: message }
                ],
                response_format: { type: "json_object" },
                max_tokens: 1000,
                temperature: 0.2,
            });

            const rawJson = response.choices[0].message?.content;
            if (!rawJson) {
                throw new Error("No response from AI");
            }

            return JSON.parse(rawJson) as ParsedIntent;
        } catch (error) {
            console.error("[AssistantService] DeepSeek Parsing Error Raw Stack:", error);
            // Return a safe default ParsedIntent so callers can proceed
            return {
                intent: "search",
                message: "Could not parse the user message; returning default search intent.",
                filters: {
                    max_price: undefined,
                    brands: [],
                    categories: [],
                    sizes: [],
                },
            } as unknown as ParsedIntent;
        }
    }
}
