import pool from '../../config/db.js';

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
    res.status(500).json({
      message: 'Server error while fetching vendors'
    });
  }
};

/* ---------------- CREATE VENDOR ---------------- */

export const createVendor = async (req, res) => {
  try {
    const {
      name,
      contact_info,
      gst_number,
      registration_date,
      rating
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Vendor name is required'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO vendors (
        name,
        contact_info,
        gst_number,
        registration_date,
        rating
      ) VALUES (?, ?, ?, ?, ?)
    `, [name, contact_info, gst_number, registration_date, rating]);

    res.status(201).json({
      vendor_id: result.insertId,
      message: 'Vendor created successfully'
    });

  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({
      message: 'Server error while creating vendor'
    });
  }
};

/* ---------------- UPDATE VENDOR ---------------- */

export const updateVendor = async (req, res) => {
  const { vendor_id } = req.params;
  const { contact_info, gst_number, rating } = req.body;

  const updates = [];
  const values = [];

  if (contact_info !== undefined) {
    updates.push('contact_info = ?');
    values.push(contact_info);
  }

  if (gst_number !== undefined) {
    updates.push('gst_number = ?');
    values.push(gst_number);
  }

  if (rating !== undefined) {
    updates.push('rating = ?');
    values.push(rating);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      message: 'No fields provided for update'
    });
  }

  values.push(vendor_id);

  try {
    const [result] = await pool.query(
      `UPDATE vendors SET ${updates.join(', ')} WHERE vendor_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    res.json({
      message: 'Vendor updated successfully'
    });

  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({
      message: 'Server error while updating vendor'
    });
  }
};

/* ---------------- DELETE VENDOR ---------------- */

export const deleteVendor = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM vendors WHERE vendor_id = ?`,
      [vendor_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Vendor not found'
      });
    }

    res.json({
      message: 'Vendor deleted successfully'
    });

  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({
      message: 'Server error while deleting vendor'
    });
  }
};
