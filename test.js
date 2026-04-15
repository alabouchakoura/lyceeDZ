import 'dotenv/config';
import {studentById} from "./services/studentService.js"
import pool from "./config/db.js";
try {
    const result = await studentById(9);
    console.log(result);
} catch (error) {
    console.log(error);
}
finally{
    pool.end();
}