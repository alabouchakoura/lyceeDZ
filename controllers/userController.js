// ROLE: Handle HTTP requests for authentication (register/login).
// WHY: Contains business logic (validation, hashing, JWT creation).
// CALLS: user.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../services/userService.js";
import {createStudent} from "../services/studentService.js";
const SECRET = "secretkey";

export const register = async (req, res) => {
  try {
     const { name, email, age,password } = req.body;
     if(!name || !email || !age || !password ){
     return res.status(400).json({error:"missing fields"});
     }
     const hashed = await bcrypt.hash(password, 10);
     await createUser(name, email, age,hashed, "student"); // only students register
     await createStudent(name,age);
     res.json({ message: "Student registered" });
  } catch (error) {
    res.status(409).json({error:"already existing mail"});
  }
};

export const login = async (req, res) => {
  try {
         const { email, password } = req.body;
         const user = await findUserByEmail(email);
  if(!user){
    return res.status(404).json({ message: "User not found" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if(!valid){
    return res.status(401).json({ message: "Wrong password" });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
  res.json({ token }); 
  } catch (error) {
    res.status(500).json({error:"internal server erroer "});
  }
};