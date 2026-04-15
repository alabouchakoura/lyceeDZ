//ROLE:define endpoints for student CRUD.
//WHY:attach middleware (auth + roles) to protect routes.
//FLOW:request → auth → role → controller
import express from "express";
import { getAllStudents, addStudent, editStudent, removeStudent,getStudentById } from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// teacher + admin can read/create/update
//base path:/api/students
router.get("/", authMiddleware, allowRoles("teacher", "admin"), getAllStudents);
router.post("/add", authMiddleware, allowRoles("teacher", "admin"), addStudent);    //path:/api/students/
router.get("/:id",authMiddleware,allowRoles("teacher","admin"),getStudentById);  //path:/api/students/
router.put("/update/:id", authMiddleware, allowRoles("teacher", "admin"), editStudent);   //path:/api/students/2  example for id=2

// only admin can delete
router.delete("/:id", authMiddleware, allowRoles("admin"), removeStudent); //path:/api/students/2  example for id=2

export default router;