"use client";

import { Spinner } from "@/components/ui/spinner";
import { setAccessToken } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const isValidToken = (token: string | null | undefined) =>
  Boolean(token && token !== "undefined" && token !== "null");

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const activeToken = isValidToken(token) ? token : storedToken;

    if (isValidToken(activeToken)) {
      if (!isValidToken(token) && storedToken) {
        dispatch(setAccessToken(storedToken));
      }
      setIsChecking(false);
      return;
    }

    router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }, [dispatch, pathname, router, token]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
