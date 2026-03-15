import { Gender } from "../models/product";

export const parseSearchQuery = (query: string) => {
    let keyword = query.trim();
    let gender: Gender | undefined = undefined;
    let max_price: number | undefined = undefined;
    let limit = 20;

    if (/\bwomen\b|\bfemale\b|\bgirls?\b|\bladies\b/i.test(keyword)) {
        gender = Gender.FEMALE;
        keyword = keyword.replace(/\bfor\s+women\b|\bwomen'?s?\b|\bfemale\b|\bgirls?\b|\bladies\b/gi, "").trim();
    } else if (/\bmen\b|\bmale\b|\bman\b|\bboys?\b/i.test(keyword)) {
        gender = Gender.MALE;
        keyword = keyword.replace(/\bfor\s+men\b|\bmen'?s?\b|\bmale\b|\bman\b|\bboys?\b/gi, "").trim();
    }

    // ✅ ₹ properly handle karo
    const priceMatch = keyword.match(/under\s*[₹\u20B9Rs.]?\s*(\d+)|below\s*[₹\u20B9Rs.]?\s*(\d+)/i);
    if (priceMatch) {
        max_price = parseInt(priceMatch[1] || priceMatch[2]);
        keyword = keyword.replace(/under\s*[₹\u20B9Rs.]?\s*\d+|below\s*[₹\u20B9Rs.]?\s*\d+/gi, "").trim();
    }

    console.log("PARSED:", { keyword, gender, max_price }); // ✅ debug log

    return { keyword, gender, max_price, limit };
};