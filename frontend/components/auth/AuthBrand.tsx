import BrandLogo from "@/components/branding/BrandLogo";

type AuthBrandProps = {
  className?: string;
};

export default function AuthBrand({ className }: AuthBrandProps) {
  return <BrandLogo logoClassName="w-54" className={className} />;
}
