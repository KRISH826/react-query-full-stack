import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let productUrls: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/?limit=500&page=1`, {
            next: { revalidate: 3600 },
        });
        const json = await res.json();
        productUrls = json.data.map((p: { id: string; updatedAt?: string }) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${p.id}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    } catch (error) {
        console.error("Sitemap fetch failed:", error);
    }
    return [
        { url: `${process.env.NEXT_PUBLIC_SITE_URL}/`, changeFrequency: "daily", priority: 1.0 },
        { url: `${process.env.NEXT_PUBLIC_SITE_URL}/product`, changeFrequency: "daily", priority: 0.9 },
        ...productUrls,
    ];
}