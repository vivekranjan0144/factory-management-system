import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';

/* ---------------- CREATE USER ---------------- */

export const createUser = async (req, res) => {
  try {
    const { employee_id, email, password } = req.body;

    if (!employee_id || !email || !password) {
      return res.status(400).json({
        message: 'employee_id, email and password are required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    /* ✅ Check duplicate email */
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    /* ✅ Validate employee exists */
    const [employee] = await pool.query(
      'SELECT employee_id FROM employee WHERE employee_id = ?',
      [employee_id]
    );

    if (employee.length === 0) {
      return res.status(400).json({ message: 'Invalid employee_id' });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (employee_id, email, password_hash)
       VALUES (?, ?, ?)`,
      [employee_id, cleanEmail, hash]
    );

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

/* ---------------- LIST USERS ---------------- */

export const listUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.user_id,
        u.employee_id,
        e.name,
        u.email,
        e.role,
        e.factory_location_id,
        fl.area_name
      FROM users u
      JOIN employee e 
        ON u.employee_id = e.employee_id
      LEFT JOIN factory_location fl 
        ON fl.factory_location_id = e.factory_location_id
    `);

    res.json(users);

  } catch (error) {
    console.error('List users error:', error.message);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

/* ---------------- UPDATE USER EMAIL ---------------- */

export const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    /* ✅ Prevent duplicate */
    const [duplicate] = await pool.query(
      'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
      [cleanEmail, user_id]
    );

    if (duplicate.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const [result] = await pool.query(
      'UPDATE users SET email = ? WHERE user_id = ?',
      [cleanEmail, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User email updated successfully' });

  } catch (error) {
    console.error('Update user error:', error.message);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

/* ---------------- UPDATE PASSWORD ---------------- */

export const updateUserPassword = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { new_password } = req.body;

    if (!new_password) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const hash = await bcrypt.hash(new_password, 10);

    const [result] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hash, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User password updated successfully' });

  } catch (error) {
    console.error('Update password error:', error.message);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};

/* ---------------- DELETE USER ---------------- */

export const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM users WHERE user_id = ?',
      [user_id]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

/* ---------------- EMPLOYEE ID LIST ---------------- */

export const employeeList = async (req, res) => {
  try {
    const [employees] = await pool.query(
      'SELECT employee_id FROM employee'
    );

    res.json(employees);

  } catch (error) {
    console.error('Employee list error:', error.message);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
};

/* ---------------- EMPLOYEE DETAILS ---------------- */

export const employeeNameList = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const [employees] = await pool.query(
      'SELECT name, role, factory_location_id FROM employee WHERE employee_id = ?',
      [employee_id]
    );

    res.json(employees);

  } catch (error) {
    console.error('Employee details error:', error.message);
    res.status(500).json({ message: 'Server error while fetching employee details' });
  }
};
