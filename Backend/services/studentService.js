// ROLE: Handle all database operations related to students.
// WHY: Centralize SQL logic for students.
// USED BY: student.controller.js
import { pool } from "../config/db.js";

export const getStudents = async () => {
  const [rows] = await pool.query("SELECT * FROM students");
  return rows;
};
export const studentById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM students where id=?",[id]);
  return rows[0];
};
export const createStudent = async (name, age) => {
  await pool.query("INSERT INTO students (name, age) VALUES (?, ?)", [name, age]);
};

export const updateStudent = async (id, name, age) => {
  await pool.query("UPDATE students SET name=?, age=? WHERE id=?", [name, age, id]);
};

export const deleteStudent = async (id) => {
  await pool.query("DELETE FROM students WHERE id=?", [id]);
};