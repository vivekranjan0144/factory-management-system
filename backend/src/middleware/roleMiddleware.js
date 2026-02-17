export const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Unauthorized. Token verification missing.'
        });
      }

      if (!allowedRoles.length) {
        return res.status(500).json({
          message: 'Role configuration error: No roles defined'
        });
      }

      const userRole = req.user.role?.toLowerCase().trim();
      const normalizedRoles = allowedRoles.map(r => r.toLowerCase().trim());

      if (!normalizedRoles.includes(userRole)) {
        return res.status(403).json({
          message: 'You do not have permission to access this resource'
        });
      }

      next();

    } catch (error) {

      if (process.env.NODE_ENV !== 'production') {
        console.error('Role authorization error:', error.message);
      }

      return res.status(500).json({
        message: 'Server error during role authorization'
      });
    }
  };
};
