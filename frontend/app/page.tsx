import HomePage from "@/components/home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DropCulture — Premium Fashion Store",
  description: "Shop premium fashion at DropCulture. Discover curated collections for men and women.",
  openGraph: {
    title: "DropCulture — Premium Fashion Store",
    description: "Shop premium fashion at DropCulture.",
    url: "https://www.dropculture.krishnendupanja.online",
    siteName: "DropCulture",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
