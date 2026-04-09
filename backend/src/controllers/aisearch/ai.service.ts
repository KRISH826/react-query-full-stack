// ai.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProductAITags } from "../../models/aimodel";
import { aiClient } from "../../utils/deepseek";
import { PRODUCT_TAG_PROMPT } from "./ai.prompt";
import { config } from "../../config/config";

const genAI = new GoogleGenerativeAI(config.gemini.api_id!);

interface ProductTagInput {
    productname: string;
    description: string;
    brand?: string;
    gender?: string;
    category_names: string[];
    imageBase64?: string; // Image analysis ke liye base64 string
}

export class AiService {
    static async generateProductTags(
        product: ProductTagInput
    ): Promise<ProductAITags | null> {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-3.1-flash-lite-preview",
                generationConfig: {
                    responseMimeType: "application/json",
                    maxOutputTokens: 1000,
                }
            });
            const promptText = `
            ${PRODUCT_TAG_PROMPT}

                CONTEXT:
                Product: ${product.productname}
                Brand: ${product.brand ?? "Unknown"}
                Gender: ${product.gender ?? "Unknown"}
                Categories: ${product.category_names.join(", ")}
                Description: ${product.description}

                VISION TASK: Look at the product image. Identify the exact color, fabric texture, 
                neckline, and fit. Use these visual signals to refine the JSON output.
            `;

            const contentParts = [];
            contentParts.push({ text: promptText });
            if(product.imageBase64 && product.imageBase64.length > 10) {
               const base64Data = product.imageBase64.includes(",") 
                    ? product.imageBase64.split(",")[1] 
                    : product.imageBase64;

                contentParts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: "image/jpeg"
                    }
                });
            }

            const result = await model.generateContent({
                contents: [{ role: "user", parts: contentParts }]
            });
            const text = await result.response.text();

            console.log("Gemini AI Raw Response:", text);
            if(!text) throw new Error("Empty response from Gemini AI");
            
            return JSON.parse(text) as ProductAITags;

        } catch (error) {
            console.error("Gemini AI Error:", error);
            return null;
        }
    }
}