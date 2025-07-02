// middleware/checkPermission.js
const Permissions = require("../models/Permission");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { role } = req.user;
      if (role == "super-admin") {
        next();
      }
      const rolePermissions = await Permissions.findOne({ role });
      if (
        !rolePermissions ||
        !rolePermissions.perm.includes(requiredPermission)
      ) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res
        .status(500)
        .json({ message: "Server error while checking permission" });
    }
  };
};

module.exports = checkPermission;
