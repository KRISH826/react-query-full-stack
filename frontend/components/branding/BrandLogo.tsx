import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
      className="my-1"
    >
      <Image className="w-44" width={200} height={44} src="/images/logo.png" alt="Brand Logo" />
    </Link>
  );
}
