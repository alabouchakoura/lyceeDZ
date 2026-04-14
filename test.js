import bcrypt from "bcryptjs";
const password="123";
const hashed = await bcrypt.hash(password, 10);
const valid = await bcrypt.compare(password, hashed);
console.log(hashed);
console.log(valid);