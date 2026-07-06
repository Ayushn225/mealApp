import * as AuthSession from "expo-auth-session";

/**
 * Generates the redirect URL required by Clerk SSO / Expo Auth Session
 * utilizing the custom URL scheme and path.
 */
export function getClerkSSORedirectURL(): string {
  return AuthSession.makeRedirectUri({
    scheme: "mealApp",
    path: "sso-callback",
  });
}
