import OpenAI from "openai";
import { AssistantResponse, ParsedIntent } from "../../models/assistant";
import { config } from "../../config/config";
import { AI_ASSISTANT_PARSE_PROMPT } from "./assistant.prompt";
import { AssistantProductQuery } from "./assistant.repository";
import {ParsedIntentSearch} from "../../models/assistant"

export class AssistantService {
    static async getAssistantResponse(userMessage: string, page: number = 1, limit: number = 10, extraFilters: { brands?: string[]; categories?: string[]; sizes?: string[] } ): Promise<AssistantResponse> {
        const parsedResult = await this.parsedWithDeepSeek(userMessage);

        const searchFilters = {
            max_price:  parsedResult.filter.max_price  ?? undefined,
            brands:     parsedResult.filter.brands?.length     ? parsedResult.filter.brands     : extraFilters.brands,
            categories: parsedResult.filter.categories?.length ? parsedResult.filter.categories : extraFilters.categories,
            sizes:      extraFilters.sizes,
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
                model: "deepseek-reasoner", // Targets DeepSeek-R1
                messages: [
                    {role: "system", content: AI_ASSISTANT_PARSE_PROMPT},
                    {role: "user", content: message}
                ],
                response_format:{type: "json_object"},
                max_tokens: 800,
                temperature: 0.2,
            });

            const rawJson = response.choices[0].message?.content;
            if (!rawJson) {
                throw new Error("No response from AI");
            }

            return JSON.parse(rawJson) as ParsedIntent;
        } catch (error) {
            throw new Error("Failed to parse AI response");
        }    
    }
}