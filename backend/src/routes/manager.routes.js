import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  countEmployees,
  updateEmployee,
  deleteEmployee
} from '../controllers/generalManager/employee.controller.js';

import {
  getAllVendors,
  createVendor,
  deleteVendor,
  updateVendor
} from '../controllers/generalManager/vendors.controller.js';

import {
  getActiveJobBatches,
  getActiveJobs,
  getJobsWithLatestStatus
} from '../controllers/generalManager/jobs.controller.js';

const router = express.Router();

/* ---------------- EMPLOYEES ---------------- */

router.post(
  '/employees',
  verifyToken,
  authorizeRole(['general manager']),   // normalized role ✔
  createEmployee
);

router.get(
  '/employees',
  verifyToken,
  authorizeRole(['general manager']),
  getEmployees
);

router.get(
  '/employee/:employee_id',
  verifyToken,
  authorizeRole(['general manager']),
  getEmployeeById
);

router.get(
  '/countEmployee',
  verifyToken,
  authorizeRole(['general manager']),
  countEmployees
);

router.patch(
  '/employees/:employee_id',
  verifyToken,
  authorizeRole(['general manager']),
  updateEmployee
);

router.delete(
  '/delete/:employee_id',
  verifyToken,
  authorizeRole(['general manager']),
  deleteEmployee
);

/* ---------------- VENDORS ---------------- */

router.get(
  '/vendor',
  verifyToken,
  authorizeRole(['general manager']),
  getAllVendors
);

router.post(
  '/vendor',
  verifyToken,
  authorizeRole(['general manager']),
  createVendor
);

router.delete(
  '/vendor/:vendor_id',
  verifyToken,
  authorizeRole(['general manager']),
  deleteVendor
);

router.patch(
  '/vendor/:vendor_id',
  verifyToken,
  authorizeRole(['general manager']),
  updateVendor
);

/* ---------------- KPIs / JOBS ---------------- */

router.get(
  '/job-batches/active/count',
  verifyToken,
  authorizeRole(['general manager']),
  getActiveJobBatches
);

router.get(
  '/job-batches/active',
  verifyToken,
  authorizeRole(['general manager']),
  getActiveJobs
);

router.get(
  '/jobs/latest-status',
  verifyToken,
  authorizeRole(['general manager']),
  getJobsWithLatestStatus
);

export default router;
