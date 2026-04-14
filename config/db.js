//ROLE:create and export a single MySQL connection pool.
//WHY:avoid opening a new DB connection on every request.
//USED BY:services layer only.
import mysql from "mysql2/promise";
export const pool=mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME
});
export default pool;
