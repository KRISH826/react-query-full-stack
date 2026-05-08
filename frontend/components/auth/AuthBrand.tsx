import BrandLogo from "@/components/branding/BrandLogo";

type AuthBrandProps = {
  className?: string;
  light?: boolean;
};

export default function AuthBrand({ className, light = false }: AuthBrandProps) {
  return <BrandLogo className={className} light={light} />;
}
