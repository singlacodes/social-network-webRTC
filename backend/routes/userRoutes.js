import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { myProfile, userProfile } from "../controllers/userControllers.js";

const router = express.Router();
router.get("/me", isAuth,myProfile);
router.get("/user/:id", isAuth, userProfile);
export default router;
