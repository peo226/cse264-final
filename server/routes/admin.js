import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/users", adminController.getAllUsers);
router.get("/reviews", adminController.getAllReviews);
router.delete("/reviews/:id", adminController.deleteReview);

export { router };