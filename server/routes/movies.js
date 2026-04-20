import express from "express";
import * as movieController from "../controllers/movieController.js";

const router = express.Router();

router.get("/:id", movieController.getMovieDetails);
router.post("/", movieController.createMovie);

export { router };
