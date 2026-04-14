--ROLE:define the database structure (tables).
--WHY:this is the "source of truth" for your data.
--NOTE:run this once in MySQL to create tables.
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    age INT,
    password VARCHAR(255),
    role ENUM('student','teacher','admin')
 );