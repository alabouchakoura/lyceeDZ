// ROLE: Handle all database operations related to users.
// WHY: Keep SQL queries separated from controllers.
// USED BY: user.controller.js
import  pool  from "../config/db.js";

export const createUser = async (name, email,age, password, role) => {
  await pool.query(
    "INSERT INTO users (name, email,age,password, role) VALUES (?,?,?,?,?)",
    [name, email, age,password, role]
  );
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};