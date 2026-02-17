import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

/* ---------------- INITIALIZE ADMIN ---------------- */

router.get('/initialize-admin', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [adminExists] = await connection.query(
      "SELECT employee_id FROM employee WHERE role = 'admin' LIMIT 1"
    );

    if (adminExists.length > 0) {
      return res.status(400).json({
        message: 'Admin already exists. Remove setup route.'
      });
    }

    console.log('Creating first admin...');

    await connection.beginTransaction();

    /* ✅ Ensure department exists (prevents FK crash) */
    await connection.query(
      `INSERT IGNORE INTO department (department_id, name)
       VALUES (1, 'Administration')`
    );

    /* ✅ Ensure factory exists (prevents FK crash) */
    await connection.query(
      `INSERT IGNORE INTO factory_location (factory_location_id, area_name)
       VALUES (1, 'Main Factory')`
    );

    const employeeDetails = {
      employee_id: '1',
      name: 'Admin',
      role: 'admin',
      department_id: 1,
      factory_id: 1
    };

    await connection.query(
      `INSERT INTO employee 
       (employee_id, name, role, department_id, factory_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        employeeDetails.employee_id,
        employeeDetails.name,
        employeeDetails.role,
        employeeDetails.department_id,
        employeeDetails.factory_id
      ]
    );

    const userDetails = {
      email: 'admin@pgi.com',
      password: 'password123'
    };

    const passwordHash = await bcrypt.hash(userDetails.password, 10);

    await connection.query(
      `INSERT INTO users (employee_id, email, password_hash)
       VALUES (?, ?, ?)`,
      [
        employeeDetails.employee_id,
        userDetails.email.toLowerCase(),
        passwordHash
      ]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Admin created successfully',
      email: userDetails.email,
      password: userDetails.password
    });

  } catch (error) {
    await connection.rollback();
    console.error('Admin creation failed:', error);

    res.status(500).json({
      message: 'Error creating admin',
      error: error.message
    });

  } finally {
    connection.release();
  }
});

export default router;
