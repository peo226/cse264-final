import {
  getBearerToken,
  verifySupabaseAccessToken,
} from "../lib/supabaseAuth.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res
        .status(401)
        .json({ error: "Authorization header is required" });
    }

    const payload = await verifySupabaseAccessToken(token);

    if (!payload.sub) {
      return res.status(401).json({ error: "Invalid token subject" });
    }

    req.user = {
      id: payload.sub,
      email: payload.email || null,
      claims: payload,
    };

    next();
  } catch (err) {
    next(err);
  }
};
