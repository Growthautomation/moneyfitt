/// <reference lib="deno.ns" />
import * as jose from "jsr:jose@v4.15.4";

// Generate a secure token for unsubscribe links
export async function generateUnsubscribeToken(userId: string): Promise<string> {
  const secret = Deno.env.get('UNSUBSCRIBE_JWT_SECRET');
  
  if (!secret) {
    throw new Error('Missing UNSUBSCRIBE_JWT_SECRET');
  }

  // Create token
  const token = await new jose.SignJWT({ userId })
    .setExpirationTime('180d') // Token expires in 180 days
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(secret));

  return token;
} 