//ROLE:verify JWT token and identify the user.
//WHY:protect routes from unauthorized access.
//ADDS:req.user = { id, role }
import jwt from "jsonwebtoken";

const SECRET=process.env.SECRET;

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if(!header){
    return res.status(401).json({ message: "No token" });
  }
  const token = header.split(" ")[1]; //extract the token from the header;

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
