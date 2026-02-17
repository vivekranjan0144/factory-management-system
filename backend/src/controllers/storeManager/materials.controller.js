import pool from '../../config/db.js';

/* ---------------- CREATE MATERIAL ---------------- */

export const createMaterial = async (req, res) => {
  try {
    const {
      name,
      category_id,
      variant_id,
      department_id,
      condition_id,
      location_id,
      uom,
      reorder_level,
      storage_temperature
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Material name is required'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO materials
      (name, category_id, variant_id, department_id, condition_id, location_id, uom, reorder_level, storage_temperature)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      category_id,
      variant_id,
      department_id,
      condition_id,
      location_id,
      uom,
      reorder_level,
      storage_temperature
    ]);

    res.status(201).json({
      material_id: result.insertId,
      message: 'Material created successfully'
    });

  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({
      message: 'Server error while creating material'
    });
  }
};

/* ---------------- GET ALL MATERIALS ---------------- */

export const getMaterials = async (req, res) => {
  try {
    const [materials] = await pool.query(`
      SELECT
        m.material_id,
        m.name,
        c.category_name AS category,
        l.location_name,
        m.uom,
        m.storage_temperature,
        m.reorder_level
      FROM materials m
      LEFT JOIN categories c ON m.category_id = c.category_id
      LEFT JOIN location l ON m.location_id = l.location_id
    `);

    res.json(materials);

  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      message: 'Server error while fetching materials'
    });
  }
};

/* ---------------- GET MATERIAL BY ID ---------------- */

export const getMaterialById = async (req, res) => {
  const { material_id } = req.params;

  try {
    const [materials] = await pool.query(
      `SELECT * FROM materials WHERE material_id = ?`,
      [material_id]
    );

    if (materials.length === 0) {
      return res.status(404).json({
        message: 'Material not found'
      });
    }

    res.json(materials[0]);

  } catch (error) {
    console.error('Get material by ID error:', error);
    res.status(500).json({
      message: 'Server error while fetching material'
    });
  }
};

/* ---------------- UPDATE MATERIAL ---------------- */

export const updateMaterial = async (req, res) => {
  const { material_id } = req.params;

  const {
    name,
    category_id,
    variant_id,
    department_id,
    condition_id,
    location_id,
    uom,
    reorder_level,
    storage_temperature
  } = req.body;

  try {
    const [result] = await pool.query(`
      UPDATE materials SET
        name = ?,
        category_id = ?,
        variant_id = ?,
        department_id = ?,
        condition_id = ?,
        location_id = ?,
        uom = ?,
        reorder_level = ?,
        storage_temperature = ?
      WHERE material_id = ?
    `, [
      name,
      category_id,
      variant_id,
      department_id,
      condition_id,
      location_id,
      uom,
      reorder_level,
      storage_temperature,
      material_id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Material not found'
      });
    }

    res.json({
      message: 'Material updated successfully'
    });

  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({
      message: 'Server error while updating material'
    });
  }
};

/* ---------------- SEARCH BY CATEGORY NAME ---------------- */

export const searchMaterialsByCategoryName = async (req, res) => {
  const { category_name } = req.params;

  if (!category_name) {
    return res.status(400).json({
      message: 'category_name parameter is required'
    });
  }

  try {
    const [materials] = await pool.query(`
      SELECT
        m.material_id,
        m.name,
        c.category_name AS category,
        l.location_name,
        m.uom,
        m.storage_temperature,
        m.reorder_level
      FROM materials m
      LEFT JOIN categories c ON m.category_id = c.category_id
      LEFT JOIN location l ON m.location_id = l.location_id
      WHERE LOWER(c.category_name) LIKE LOWER(?)
    `, [`%${category_name}%`]);

    res.json(materials);

  } catch (error) {
    console.error('Search materials error:', error);
    res.status(500).json({
      message: 'Server error while searching materials'
    });
  }
};

/* ---------------- DELETE MATERIAL ---------------- */

export const deleteMaterial = async (req, res) => {
  const { material_id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM materials WHERE material_id = ?`,
      [material_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Material not found'
      });
    }

    res.json({
      message: 'Material deleted successfully'
    });

  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      message: 'Server error while deleting material'
    });
  }
};
