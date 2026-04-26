import { cookies } from "next/headers";

export const getServerAuth = async () => {
  const cookieStore = await cookies();

  const role = cookieStore.get("role")?.value || null;

  return {
    isAuthenticated: !!role,
    role,
  };
};