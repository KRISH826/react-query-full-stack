// ai.service.ts
import { ProductAITags } from "../../models/aimodel";
import { aiClient } from "../../utils/deepseek";
import { PRODUCT_TAG_PROMPT } from "./ai.prompt";

interface ProductTagInput {
    productname: string;
    description: string;
    brand?: string;
    gender?: string;
    category_names: string[];
}

export class AiService {
    static async generateProductTags(
        product: ProductTagInput
    ): Promise<ProductAITags | null> {
        try {
            const response = await aiClient.chat.completions.create({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: PRODUCT_TAG_PROMPT
                    },
                    {
                        role: "user",
                        content: `
                            Product Name: ${product.productname}
                            Brand: ${product.brand ?? "Unknown"}
                            Gender: ${product.gender ?? "Unknown"}
                            Categories: ${product.category_names.join(", ")}
                            Description: ${product.description}

                            Analyze this clothing product and return JSON only.
                        `
                    }
                ],
                max_tokens: 500,
                temperature: 0.5
            });

            const content = response.choices?.[0]?.message.content;
            if (!content) return null;
            const cleaned = content.replace(/```json|```/g, "").trim();
            return JSON.parse(cleaned) as ProductAITags;

        } catch (error) {
            console.log(error);
            return null;
        }
    }
}