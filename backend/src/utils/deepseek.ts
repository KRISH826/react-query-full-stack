import OpenAI from "openai";
import { config } from "../config/config";

export const aiClient = new OpenAI({
    apiKey: config.deepseek.api_key,
    baseURL: config.deepseek.api_url
});
