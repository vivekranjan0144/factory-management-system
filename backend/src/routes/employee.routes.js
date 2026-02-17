import express from 'express';

import {
  createMaterial,
  getMaterials,
  getMaterialById,
  searchMaterialsByCategoryName,
  updateMaterial,
  deleteMaterial
} from '../controllers/storeManager/materials.controller.js';

import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

/* ---------------- MATERIAL ROUTES ---------------- */

router.post(
  '/',
  verifyToken,
  authorizeRole(['Store Manager']),   // normalized role (IMPORTANT)
  createMaterial
);

router.get(
  '/',
  verifyToken,
  authorizeRole(['Store Manager']),
  getMaterials
);

router.get(
  '/search/:category_name',
  verifyToken,
  authorizeRole(['Store Manager']),
  searchMaterialsByCategoryName
);

router.get(
  '/:material_id',
  verifyToken,
  authorizeRole(['Store Manager']),
  getMaterialById
);

router.put(
  '/:material_id',
  verifyToken,
  authorizeRole(['Store Manager']),
  updateMaterial
);

router.delete(
  '/:material_id',
  verifyToken,
  authorizeRole(['Store Manager']),
  deleteMaterial
);

export default router;
