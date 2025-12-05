import express from "express";
import {signup , login,logout, me} from "../controllers/auth.controller.js";
import { cookieAuth } from "../middleware/cookieAuth.js";

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.get('/me',cookieAuth,me);


export default router;