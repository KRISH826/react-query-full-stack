"use client";

import { Spinner } from "@/components/ui/spinner";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const isValidToken = (token: string | null | undefined) =>
  Boolean(token && token !== "undefined" && token !== "null");

const getRoleFromCookie = () =>
  document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("role="))
    ?.split("=")[1];

export default function GuestOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const activeToken = isValidToken(token) ? token : storedToken;

    if (isValidToken(activeToken)) {
      const role = getRoleFromCookie();
      router.replace(role === "admin" ? "/admin/dashboard" : "/product");
      return;
    }

    setIsChecking(false);
  }, [router, token]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
