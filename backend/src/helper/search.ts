export function parseSearchQuery(search: string) {

    const result: any = {};
    const lower = search.toLowerCase();
    // detect price
    const priceMatch = lower.match(/under\s*(\d+)/);
    if (priceMatch) {
        result.max_price = Number(priceMatch[1]);
    }
    if (lower.includes("men")) {
        result.gender = "MALE";
    }
    if (lower.includes("women")) {
        result.gender = "FEMALE";
    }

    const keyword = lower
        .replace(/under\s*\d+/g, "")
        .replace(/men|women/g, "")
        .trim();

    result.keyword = keyword;

    return result;
}
