//ROLE:check if user has the correct role (authorization).
//WHY:control access (teacher+admin/admin-only actions).
//USED AFTER: authMiddleware
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
