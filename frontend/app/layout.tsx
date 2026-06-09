import type { Metadata } from "next";
import { Bodoni_Moda, Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script"; // ✅ import karo
import AuthProvider from "@/provider/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const brandFont = Bodoni_Moda({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.dropculture.krishnendupanja.online"),

  title: {
    default: "DropCulture — Premium Fashion Store",
    template: "%s | DropCulture",
  },
  description: "DropCulture is your destination for premium fashion. Shop curated collections of clothing, accessories, and lifestyle products for men and women.",

  keywords: [
    "DropCulture",
    "premium fashion",
    "online fashion store",
    "men fashion",
    "women fashion",
    "clothing",
    "accessories",
    "lifestyle",
    "streetwear",
    "luxury fashion India",
  ],

  authors: [{ name: "DropCulture", url: "https://www.dropculture.krishnendupanja.online" }],
  creator: "DropCulture",
  publisher: "DropCulture",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.dropculture.krishnendupanja.online",
    siteName: "DropCulture",
    title: "DropCulture — Premium Fashion Store",
    description:
      "DropCulture is your destination for premium fashion. Shop curated collections for men and women.",
    // images: [
    //   {
    //     url: "/og-image.jpg", // 1200x630 image public/ folder mein daalo
    //     width: 1200,
    //     height: 630,
    //     alt: "DropCulture — Premium Fashion Store",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DropCulture — Premium Fashion Store",
    description:
      "DropCulture is your destination for premium fashion. Shop curated collections for men and women.",
    // images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* ✅ Yeha lagao */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <meta name="google-site-verification" content="dJ86Hm8GfWsV5KyHx7p6j-WWSEBF0boB_qlhzHIUFdg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${brandFont.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
