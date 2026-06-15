export const SIGN_IN_PATH= "/sign-in";
export const DEFAULT_AUTH_CALLBACK = "/dashboard";

export function getSafeCallbackPath(callbackPath: string | null): string {
  if ((callbackPath?.startsWith("/") && !callbackPath?.startsWith("//"))) {
    return callbackPath;
  }
  return DEFAULT_AUTH_CALLBACK;
}