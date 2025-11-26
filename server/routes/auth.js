import express from 'express';
import {authenticateUser} from '../middleware/authMiddleware.js';
import { refreshToken, logout, login, register } from "../controllers/auth/auth.js";

const router = express.Router();



router.post("/refresh_token",refreshToken);
router.post("/logout", authenticateUser, logout);
router.post("/login", login);
router.post("/register", register);


export default router;