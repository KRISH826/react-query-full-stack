import { Gender } from "../models/product";

export const parseSearchQuery = (query: string) => {

    let q = query.toLowerCase().trim();

    let gender: Gender | undefined;
    let max_price: number | undefined;
    const limit = 100;

    const priceMatch = q.match(/(?:under|below|less than|for)?\s*[₹\u20B9rs.]?\s*(\d{2,6})/i);

    if (priceMatch) {
        max_price = parseInt(priceMatch[1]);
        q = q.replace(priceMatch[0], "");
    }

    // Match women's keywords first to avoid 'men' triggering on 'women'
    if (/\b(women|woman|womens|women's|female|ladies|girls?)\b/.test(q)) {
        gender = Gender.FEMALE;
        q = q.replace(/\b(women|woman|womens|women's|female|ladies|girls?)\b/g, "");
    }
    else if (/\b(men|man|mens|men's|male|boys?)\b/.test(q)) {
        gender = Gender.MALE;
        q = q.replace(/\b(men|man|mens|men's|male|boys?)\b/g, "");
    }

    /* ---------- CLEAN ---------- */

    q = q
        .replace(/\b(for|under|below|rs|in|with)\b/gi, "")
        .replace(/[^\w\s&]/gi, "") // Remove bad punctuation except '&' for brands like H&M
        .replace(/\s+/g, " ")
        .trim();

    /* ---------- TOKENIZE ---------- */

    const tokens = q.split(" ").filter(Boolean);

    console.log("SEARCH PARSED", {
        keyword: q,
        tokens,
        gender,
        max_price
    });

    return {
        keyword: q,
        tokens,
        gender,
        max_price,
        limit
    };
};
