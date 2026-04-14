--ROLE: Define the database structure (tables).
--WHY: This is the "source of truth" for your data.
--NOTE: Run this once in MySQL to create tables.
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT
);