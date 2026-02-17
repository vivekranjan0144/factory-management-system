import pool from '../../config/db.js';

/* ---------------- CREATE EMPLOYEE ---------------- */

export const createEmployee = async (req, res) => {
  const {
    employee_id,
    department_id,
    name,
    role,
    contact_number,
    joining_date,
    factory_id
  } = req.body;

  try {
    if (!employee_id || !name || !role) {
      return res.status(400).json({ message: 'employee_id, name, role required.' });
    }

    await pool.query(
      `INSERT INTO employee (
        employee_id,
        department_id,
        name,
        role,
        contact_number,
        joining_date,
        factory_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, department_id, name, role, contact_number, joining_date, factory_id]
    );

    res.status(201).json({
      message: 'Employee created successfully',
      employee_id
    });

  } catch (error) {
    console.error('Create Employee error:', error);
    res.status(500).json({ message: 'Server error while creating employee' });
  }
};

/* ---------------- GET ALL EMPLOYEES ---------------- */

export const getEmployees = async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT
        e.employee_id,
        e.name,
        e.contact_number,
        d.name AS department_name,
        e.role,
        f.area_name AS factory_area_name
      FROM employee e
      LEFT JOIN department d ON e.department_id = d.department_id
      LEFT JOIN factory_location f ON e.factory_id = f.factory_location_id
    `);

    res.json(employees);

  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error while fetching employees.' });
  }
};

/* ---------------- GET EMPLOYEE BY ID ---------------- */

export const getEmployeeById = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT
        e.employee_id,
        e.name,
        e.contact_number,
        d.name AS department_name,
        e.role,
        f.area_name AS factory_area_name,
        e.joining_date
      FROM employee e
      LEFT JOIN department d ON e.department_id = d.department_id
      LEFT JOIN factory_location f ON e.factory_id = f.factory_location_id
      WHERE e.employee_id = ?
    `, [employee_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Get employee by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching employee.' });
  }
};

/* ---------------- COUNT EMPLOYEES ---------------- */

export const countEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM employee');
    res.json({ total: rows[0].total });

  } catch (error) {
    console.error('Count employees error:', error);
    res.status(500).json({ message: 'Server error while counting employees.' });
  }
};

/* ---------------- UPDATE EMPLOYEE ---------------- */

export const updateEmployee = async (req, res) => {
  const { employee_id } = req.params;
  const { contact_number, department_id, role, factory_id } = req.body;

  const updates = [];
  const values = [];

  if (contact_number !== undefined) {
    updates.push('contact_number = ?');
    values.push(contact_number);
  }

  if (department_id !== undefined) {
    updates.push('department_id = ?');
    values.push(department_id);
  }

  if (role !== undefined) {
    updates.push('role = ?');
    values.push(role);
  }

  if (factory_id !== undefined) {
    updates.push('factory_id = ?');
    values.push(factory_id);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update.' });
  }

  values.push(employee_id);

  try {
    const [result] = await pool.query(
      `UPDATE employee SET ${updates.join(', ')} WHERE employee_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json({ message: 'Employee updated successfully.' });

  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error while updating employee.' });
  }
};

/* ---------------- DELETE EMPLOYEE ---------------- */

export const deleteEmployee = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM employee WHERE employee_id = ?',
      [employee_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json({ message: 'Employee deleted successfully.' });

  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error while deleting employee.' });
  }
};

/* ---------------- GET ALL VENDORS ---------------- */

export const getAllVendors = async (req, res) => {
  try {
    const [vendors] = await pool.query(`
      SELECT
        vendor_id,
        name,
        contact_info,
        gst_number,
        registration_date,
        rating
      FROM vendors
    `);

    res.json(vendors);

  } catch (error) {
    console.error('Get all vendors error:', error);
    res.status(500).json({ message: 'Server error while fetching vendors.' });
  }
};
