import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  readonly className?: string;
  readonly href?: string;
  readonly logoClassName?: string;
};

export default function BrandLogo({
  href = "/",
  className = "",
  logoClassName = "",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={`block my-1 ${className}`}
    >
      <Image className={cn("w-44 h-auto", logoClassName)} width={250} height={60} src="/images/logo.png" alt="Brand Logo" />
    </Link>
  );
}
