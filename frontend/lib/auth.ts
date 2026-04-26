import { cookies } from "next/headers";

export const getServerAuth = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || null;
  const role = cookieStore.get("role")?.value || null;

  return {
    isAuthenticated: !!accessToken,
    accessToken,
    role,
  };
};
