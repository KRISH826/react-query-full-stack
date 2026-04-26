import { cookies } from "next/headers";

export const getServerAuth = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value || null;
  const role = cookieStore.get("role")?.value || null;

  return {
    isAuthenticated: !!refreshToken,
    refreshToken,
    role,
  };
};