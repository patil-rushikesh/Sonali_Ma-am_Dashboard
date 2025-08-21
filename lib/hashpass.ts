import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashString(str: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(str, salt);
}

// Compare a string with a hash
export async function compareHash(str: string, hash: string): Promise<boolean> {
  return bcrypt.compare(str, hash);
}

// Sign a JWT token with a payload and secret
export function signJwt(payload: object, secret: string, options?: jwt.SignOptions): string {
  return jwt.sign(payload, secret, options);
}

// Verify a JWT token and return the decoded payload
export function verifyJwt(token: string, secret: string): any {
  return jwt.verify(token, secret);
}
