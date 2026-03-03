import OpenAI from "openai";
import { config } from "../config/config";

export const aiClient = new OpenAI({
    apiKey: config.deepseek.api_key,
    baseURL: config.deepseek.api_url
});

export async function testDeepSeek() {
    const client = new OpenAI({
        apiKey: config.deepseek.api_key,
        baseURL: config.deepseek.api_url
    });

    const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            {
                role: "user",
                content: "what is node js",
            },
        ],
    });

    console.log(response.choices[0].message.content);
}