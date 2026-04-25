import express from "express";
import * as watchlistController from "../controllers/watchlistController.js";

const router = express.Router();

router.get("/:userId", watchlistController.getWatchlist);
router.post("/", watchlistController.addMovie);
router.delete("/:userId/:movieId", watchlistController.removeMovie);

export { router };
