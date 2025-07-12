import express from "express";
import { Login, Logout, Signup , updateprofilepic,checkAuth} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup" ,Signup);

router.post("/login",Login);

router.post("/logout",Logout);

router.put("/update-profilepic", protectRoute,  updateprofilepic);
router.get("/check", protectRoute, checkAuth)
export default router; 
