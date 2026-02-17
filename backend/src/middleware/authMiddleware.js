import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig.js';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: 'Invalid authorization format.'
      });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);

    req.user = decoded;

    next();

  } catch (error) {
    console.error('Token verification error:', error.message);

    return res.status(401).json({
      message: 'Invalid or expired token.'
    });
  }
};
