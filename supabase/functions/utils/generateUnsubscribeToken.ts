import { create, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

// Generate a secure token for unsubscribe links
export async function generateUnsubscribeToken(userId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get('JWT_SECRET_KEY') || 'your-fallback-secret-key'),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Create JWT with 30 days expiration
  const token = await create(
    { alg: "HS256", typ: "JWT" },
    { 
      userId,
      exp: getNumericDate(60 * 60 * 24 * 30) // 30 days
    },
    key
  );

  return token;
} 