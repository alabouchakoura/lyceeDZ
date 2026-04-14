// ROLE: Handle HTTP requests for authentication (register/login).
// WHY: Contains business logic (validation, hashing, JWT creation).
// CALLS: user.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../services/userService.js";

const SECRET = "secretkey";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await createUser(name, email, hashed, "student"); // only students register

  res.json({ message: "Student registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);

  res.json({ token });
};