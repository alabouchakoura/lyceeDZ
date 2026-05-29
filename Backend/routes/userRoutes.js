//ROLE:define endpoints for authentication.
//WHY:map URL → controller functions.
//FLOW: request → route → controller
import express from "express";
import { register, login } from "../controllers/userController.js";

const router = express.Router();
//base path /api/users
router.post("/register", register); //path:/api/users/register
router.post("/login", login);  //path:/api/users/login

export default router;