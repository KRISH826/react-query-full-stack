import OpenAI from "openai";
import { AssistantResponse, ParsedIntent } from "../../models/assistant";
import { config } from "../../config/config";
import { AI_ASSISTANT_PARSE_PROMPT } from "./assistant.prompt";
import { AssistantProductQuery } from "./assistant.repository";
import {ParsedIntentSearch} from "../../models/assistant"

export class AssistantService {
    static async getAssistantResponse(userMessage: string, page: number = 1, limit: number = 10, extraFilters?: { brands?: string[]; categories?: string[]; sizes?: string[] } ): Promise<AssistantResponse> {
        const parsedResult = await this.parsedWithDeepSeek(userMessage);

        const searchFilters = {
            max_price:  parsedResult.filters.max_price  ?? undefined,
            brands:     parsedResult.filters.brands?.length     ? parsedResult.filters.brands     : extraFilters?.brands,
            categories: parsedResult.filters.categories?.length ? parsedResult.filters.categories : extraFilters?.categories,
            sizes:      extraFilters?.sizes,
        };

        const searchResults = await AssistantProductQuery(
            parsedResult.intent as unknown as ParsedIntentSearch,
            searchFilters,
            page,
            limit
        );

       return {
            success:    true,
            message:    parsedResult.message,
            products:   searchResults.data,
            page:       searchResults.page,
            totalPages: searchResults.totalPages,
            intent:     parsedResult,
        };
    }

    private static async parsedWithDeepSeek(message: string): Promise<ParsedIntent> {
        try {
            const openAi = new OpenAI({
                baseURL: config.deepseek.api_url,
                apiKey: config.deepseek.api_key,
                timeout: 10000,
            })

            const response = await openAi.chat.completions.create({
                model: "deepseek-chat", // Targets DeepSeek-R1
                messages: [
                    {role: "system", content: AI_ASSISTANT_PARSE_PROMPT},
                    {role: "user", content: message}
                ],
                response_format:{type: "json_object"},
                max_tokens: 1000,
                temperature: 0.4,
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