import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/:id", userController.getUser);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export { router };
