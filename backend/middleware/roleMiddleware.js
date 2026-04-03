export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({ error: "Forbidden: role not found" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error.message);
      return res.status(500).json({ error: "Role authorization failed" });
    }
  };
};