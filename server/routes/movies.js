import express from "express";
import * as movieController from "../controllers/movieController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", movieController.getMovies);
router.get("/tmdb/:tmdbId", movieController.getMovieByTmdbId);
router.get("/:id", movieController.getMovieDetails);
router.post("/", requireAdmin, movieController.createMovie);

export { router };
