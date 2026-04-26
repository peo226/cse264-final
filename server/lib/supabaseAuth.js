import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is required");
}

if (!supabaseAnonKey) {
  throw new Error("SUPABASE_ANON_KEY is required");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getBearerToken = (req) => {
  const authHeader = req.get("authorization") || "";
  const bearerPrefix = "Bearer ";

  if (!authHeader.startsWith(bearerPrefix)) {
    return null;
  }

  const token = authHeader.slice(bearerPrefix.length).trim();
  return token || null;
};

export const verifySupabaseAccessToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    const authError = new Error("Invalid or expired token");
    authError.status = 401;
    throw authError;
  }

  return {
    sub: data.user.id,
    email: data.user.email || null,
    user: data.user,
  };
};