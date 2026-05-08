import Link from "next/link";
import { cn } from "@/lib/utils";

type AuthBrandProps = {
  className?: string;
  light?: boolean;
};

export default function AuthBrand({ className, light = false }: AuthBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 transition-opacity hover:opacity-90",
        light ? "text-white" : "text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "font-auth-brand flex h-12 w-12 items-center justify-center rounded-full border text-lg font-semibold tracking-[0.14em]",
          light
            ? "border-white/30 bg-black/10 text-white shadow-lg shadow-black/10"
            : "border-[#c9b7a3]/60 bg-[#f7f2ea] text-[#5b4635] shadow-sm"
        )}
      >
        Z
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-auth-brand text-[1.85rem] font-semibold uppercase tracking-[0.22em]", light ? "text-white" : "text-slate-900")}>
          ZOVARA
        </span>
        <span className={cn("mt-1 pl-[0.1em] text-[0.58rem] font-semibold uppercase tracking-[0.52em]", light ? "text-white/70" : "text-[#8a7867]")}>
          Refined Wardrobe
        </span>
      </span>
    </Link>
  );
}
