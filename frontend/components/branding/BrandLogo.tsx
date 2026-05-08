import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  readonly className?: string;
  readonly compact?: boolean;
  readonly href?: string;
  readonly light?: boolean;
  readonly showTagline?: boolean;
};

export default function BrandLogo({
  className,
  compact = false,
  href = "/",
  light = false,
  showTagline = true,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        compact ? "gap-2.5" : "gap-3",
        light ? "text-white" : "text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "font-brand flex items-center justify-center rounded-full border font-semibold",
          compact ? "h-10 w-10 text-base tracking-[0.12em]" : "h-12 w-12 text-lg tracking-[0.14em]",
          light
            ? "border-white/30 bg-black/10 text-white shadow-lg shadow-black/10"
            : "border-[#c9b7a3]/60 bg-[#f7f2ea] text-[#5b4635] shadow-sm"
        )}
      >
        Z
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-brand font-semibold uppercase",
            compact ? "text-[1rem] tracking-[0.18em] md:text-[1.2rem]" : "text-[1.55rem] tracking-[0.22em]",
            light ? "text-white" : "text-slate-900"
          )}
        >
          ZOVARA
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 pl-[0.1em] text-[0.58rem] font-semibold uppercase tracking-[0.52em]",
              light ? "text-white/70" : "text-[#8a7867]"
            )}
          >
            Refined Wardrobe
          </span>
        ) : null}
      </span>
    </Link>
  );
}
