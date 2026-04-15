// ROLE: Handle HTTP requests for student CRUD.
// WHY: Converts request → service calls → response.
// CALLS: student.service.js
import { getStudents, createStudent, updateStudent, deleteStudent, studentById } from "../services/studentService.js";

export const getAllStudents = async (req, res) => {
  try {
   const students = await getStudents();
   res.json(students); 
  } catch (error){
    res.status(404).json({"error":"no students"});
  }
};
export const getStudentById=async(req,res)=>{
  try {
   const { id }=req.params;
   const student=await studentById(id);
res.json(student); 
  }catch (error) {
      res.status(404).json({"error":"no student"});
  }
}
export const addStudent = async (req, res) => {
  try {
    const { name, age } = req.body;
   await createStudent(name, age);
   res.json({ message: "Student added" });
  } catch (error) {
    res.status(500).json({"error":"internal server error"}); 
  }

};

export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;
    await updateStudent(id, name, age);
  res.json({ message: "Student updated" }); 
  } catch (error) {
    res.status(500).json({"error":"internal server error"}); 
  }
};

export const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteStudent(id);
    res.json({ message: "Student deleted" }); 
  } catch (error) {
    res.status(500).json({"error":"internal server error"}); 
  }
};