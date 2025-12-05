import express from "express";
import { authMiddleware } from "../middleware/auth.Middleware.js";
import { createCut, getMyCuts, deleteCut } from "../controllers/cut.controller.js";

const router = express.Router();

// all routes need auth
router.use(authMiddleware);

router.post("/", createCut);        // POST /api/cuts
router.get("/my", getMyCuts);       // GET /api/cuts/my
router.delete("/:id", deleteCut);   // DELETE /api/cuts/:id (optional)

export default router;
