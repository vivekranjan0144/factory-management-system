import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
  updateUserPassword,
  employeeList,
  employeeNameList
} from '../controllers/admin/user.controller.js';

const router = express.Router();

/* ---------------- USER MANAGEMENT ---------------- */

router.post(
  '/users',
  verifyToken,
  authorizeRole(['admin']),
  createUser
);

router.get(
  '/users',
  verifyToken,
  authorizeRole(['admin']),
  listUsers
);

router.put(
  '/users/:user_id',
  verifyToken,
  authorizeRole(['admin']),
  updateUser
);

router.delete(
  '/users/:user_id',
  verifyToken,
  authorizeRole(['admin']),
  deleteUser
);

router.put(
  '/users/:user_id/password',
  verifyToken,
  authorizeRole(['admin']),
  updateUserPassword
);

/* ---------------- EMPLOYEE HELPERS ---------------- */

router.get(
  '/emp_id',
  verifyToken,
  authorizeRole(['admin']),
  employeeList
);

router.get(
  '/employee/:employee_id',
  verifyToken,
  authorizeRole(['admin']),
  employeeNameList
);

export default router;
