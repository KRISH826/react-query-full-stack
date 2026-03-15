import { Gender } from "../models/product";

export const parseSearchQuery = (query: string) => {

    let q = query.toLowerCase().trim();

    let gender: Gender | undefined;
    let max_price: number | undefined;
    const limit = 100;

    const priceMatch = q.match(/(?:under|below|less than)?\s*[₹\u20B9rs.]?\s*(\d{2,6})/i);

    if (priceMatch) {
        max_price = parseInt(priceMatch[1]);
        q = q.replace(priceMatch[0], "");
    }

    if (/\b(women|woman|womens|women's|female|ladies|girls?)\b/.test(q)) {
        gender = Gender.FEMALE;
        q = q.replace(/\b(women|woman|womens|women's|female|ladies|girls?)\b/g, "");
    }

    if (/\b(men|man|mens|men's|male|boys?)\b/.test(q)) {
        gender = Gender.MALE;
        q = q.replace(/\b(men|man|mens|men's|male|boys?)\b/g, "");
    }

    q = q
        .replace(/\bfor\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

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
