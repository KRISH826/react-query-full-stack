const AUTH_MAX_AGE = 60 * 60 * 24 * 10;

function getCookieAttributes(maxAge: number) {
  const isSecureContext =
    typeof window !== "undefined" && window.location.protocol === "https:";

  return `path=/; max-age=${maxAge}; SameSite=Lax${isSecureContext ? "; Secure" : ""}`;
}

export function persistClientAuth(accessToken: string, role: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `accessToken=${encodeURIComponent(accessToken)}; ${getCookieAttributes(
    AUTH_MAX_AGE
  )}`;
  document.cookie = `role=${encodeURIComponent(role)}; ${getCookieAttributes(AUTH_MAX_AGE)}`;

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("token", accessToken);
  }
}

export function clearClientAuth() {
  if (typeof document !== "undefined") {
    document.cookie = `accessToken=; ${getCookieAttributes(0)}`;
    document.cookie = `role=; ${getCookieAttributes(0)}`;
  }

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("token");
  }
}
