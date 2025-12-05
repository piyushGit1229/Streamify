import express from "express";
import { explorePage } from "../controllers/explore.controller.js";

const router = express.Router();

router.get("/", explorePage);

export default router;
