import Image from "next/image";
import { ReactNode } from "react";
import AuthBrand from "./AuthBrand";

type AuthPageShellProps = {
  title: string;
  description: string;
  imageSrc: string;
  children: ReactNode;
  footer?: ReactNode;
};

const authQuote =
  "Elevated essentials, polished details, and a wardrobe experience designed to feel effortless at every step.";

export default function AuthPageShell({
  title,
  description,
  imageSrc,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="relative flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col overflow-hidden p-10 text-primary lg:flex dark:border-r">
        <div className="absolute inset-0 w-full">
          <Image src={imageSrc} width={1080} height={1080} alt="Fashion" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>
        <AuthBrand className="relative z-20" />
        <div className="relative z-20 mt-auto max-w-md text-white/78">
          <blockquote className="text-base leading-7 text-balance">
            &ldquo;{authQuote}&rdquo;
          </blockquote>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#f7f2ea] via-[#fcfaf6] to-white p-4 py-6 md:py-10 lg:h-screen lg:bg-transparent lg:p-8">
        <div className="w-full max-w-md rounded-[32px] border border-black/5 bg-white/92 p-5 shadow-[0_30px_80px_-34px_rgba(15,23,42,0.35)] backdrop-blur-sm md:p-8 lg:max-w-sm lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
          <div className="mb-8 lg:hidden">
            <AuthBrand />
          </div>

          <div className="mx-auto flex w-full flex-col justify-center gap-4">
            <div className="mb-4 flex flex-col gap-2 text-start">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer ? <div className="pt-2">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
