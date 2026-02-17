import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { findUserByEmail } from '../services/user.service.js';
import jwtConfig from '../config/jwtConfig.js';

dotenv.config();

/* ---------------- LOGIN ---------------- */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        employee_id: user.employee_id,
        factory_location_id: user.factory_location_id,
        role: user.role,
        department_id: user.department_id,
        name: user.name
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      token,
      role: user.role,
      factory_id: user.factory_id,
      department_id: user.department_id,
      name: user.name
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error during login'
    });
  }
};

/* ---------------- LOGOUT ---------------- */

export const logout = (req, res) => {
  res.json({
    message: 'Logged out successfully'
  });
};
