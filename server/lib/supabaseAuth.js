import { webcrypto } from "node:crypto";

const textEncoder = new TextEncoder();
const jwkCache = new Map();
let jwksFetchedAt = 0;

const getSupabaseBaseUrl = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

  if (!url) {
    const error = new Error("SUPABASE_URL is required");
    error.status = 500;
    throw error;
  }

  return url.replace(/\/$/, "");
};

export const getSupabaseIssuer = () => `${getSupabaseBaseUrl()}/auth/v1`;

const getSupabaseJwksUrl = () => `${getSupabaseIssuer()}/.well-known/jwks.json`;

export const getBearerToken = (req) => {
  const authHeader = req.get("authorization") || "";
  const bearerPrefix = "Bearer ";

  if (!authHeader.startsWith(bearerPrefix)) {
    return null;
  }

  const token = authHeader.slice(bearerPrefix.length).trim();
  return token || null;
};

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64");
};

const parseJwt = (token) => {
  const parts = token.split(".");

  if (parts.length !== 3) {
    const error = new Error("Invalid authorization token");
    error.status = 401;
    throw error;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  return {
    header: JSON.parse(decodeBase64Url(encodedHeader).toString("utf8")),
    payload: JSON.parse(decodeBase64Url(encodedPayload).toString("utf8")),
    signature: decodeBase64Url(encodedSignature),
    signingInput: `${encodedHeader}.${encodedPayload}`,
  };
};

const getJwkForKid = async (kid) => {
  const cacheEntry = jwkCache.get(kid);
  const cacheAgeMs = Date.now() - jwksFetchedAt;

  if (cacheEntry && cacheAgeMs < 60 * 60 * 1000) {
    return cacheEntry;
  }

  const response = await fetch(getSupabaseJwksUrl());

  if (!response.ok) {
    const error = new Error("Unable to load Supabase signing keys");
    error.status = 503;
    throw error;
  }

  const { keys = [] } = await response.json();
  jwksFetchedAt = Date.now();
  jwkCache.clear();

  for (const key of keys) {
    jwkCache.set(key.kid, key);
  }

  const jwk = jwkCache.get(kid);

  if (!jwk) {
    const error = new Error("JWT signing key not found");
    error.status = 401;
    throw error;
  }

  return jwk;
};

const importJwk = async (jwk) => {
  return webcrypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["verify"],
  );
};

export const verifySupabaseAccessToken = async (token) => {
  const { header, payload, signature, signingInput } = parseJwt(token);

  if (header.alg !== "RS256") {
    const error = new Error("Unsupported token algorithm");
    error.status = 401;
    throw error;
  }

  if (!header.kid) {
    const error = new Error("Missing token key id");
    error.status = 401;
    throw error;
  }

  if (payload.iss !== getSupabaseIssuer()) {
    const error = new Error("Invalid token issuer");
    error.status = 401;
    throw error;
  }

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    const error = new Error("Token has expired");
    error.status = 401;
    throw error;
  }

  const jwk = await getJwkForKid(header.kid);
  const key = await importJwk(jwk);
  const verified = await webcrypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    signature,
    textEncoder.encode(signingInput),
  );

  if (!verified) {
    const error = new Error("Invalid token signature");
    error.status = 401;
    throw error;
  }

  return payload;
};
