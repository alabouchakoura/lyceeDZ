// ROLE: Entry point of the application.
// WHY: Initialize Express, register routes, start server.
// CONNECTS: everything together
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});