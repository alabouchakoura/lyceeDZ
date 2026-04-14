// ROLE: Handle HTTP requests for student CRUD.
// WHY: Converts request → service calls → response.
// CALLS: student.service.js
import { getStudents, createStudent, updateStudent, deleteStudent } from "../services/studentService.js";

export const getAllStudents = async (req, res) => {
  const students = await getStudents();
  res.json(students);
};

export const addStudent = async (req, res) => {
  const { name, age } = req.body;
  await createStudent(name, age);
  res.json({ message: "Student added" });
};

export const editStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  await updateStudent(id, name, age);
  res.json({ message: "Student updated" });
};

export const removeStudent = async (req, res) => {
  const { id } = req.params;
  await deleteStudent(id);
  res.json({ message: "Student deleted" });
};