import { query } from "../db/postgres.js";
import {
  getBearerToken,
  verifySupabaseAccessToken,
} from "../lib/supabaseAuth.js";

export const requireAdmin = async (req, res, next) => {
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

    const result = await query("SELECT role FROM users WHERE id = $1", [
      payload.sub,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = {
      id: payload.sub,
      email: payload.email || null,
      role: user.role,
    };
    next();
  } catch (err) {
    next(err);
  }
};
