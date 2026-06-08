import express from "express";
import {askToAssistant, getCurrentUser, updateAssistant} from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const UserRouter=express.Router()

UserRouter.get("/current",isAuth,getCurrentUser);
UserRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant);
UserRouter.post("/asktoassistant",isAuth,askToAssistant)
export default UserRouter;
