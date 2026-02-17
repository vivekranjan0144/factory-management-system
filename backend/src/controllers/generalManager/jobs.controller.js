import pool from '../../config/db.js';

/* ---------------- COUNT ACTIVE JOB BATCHES ---------------- */

export const getActiveJobBatches = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT COUNT(*) AS active_job_batches
      FROM (
        SELECT js.batch_id
        FROM job_status js
        INNER JOIN (
          SELECT batch_id, MAX(createdAt) AS max_created
          FROM job_status
          GROUP BY batch_id
        ) latest
          ON js.batch_id = latest.batch_id
         AND js.createdAt = latest.max_created
        WHERE js.status = 'active'
      ) AS active_batches
    `);

    res.json({
      activeJobBatches: results[0].active_job_batches
    });

  } catch (error) {
    console.error('Active job batches error:', error);
    res.status(500).json({
      message: 'Server error while counting active job batches'
    });
  }
};

/* ---------------- GET ACTIVE JOBS ---------------- */

export const getActiveJobs = async (req, res) => {
  try {
    const [jobs] = await pool.query(`
      SELECT 
        j.job_id, 
        j.scheduled_start, 
        j.scheduled_end, 
        j.actual_start, 
        j.actual_end, 
        j.manager_id, 
        j.createdAt, 
        j.updatedAt, 
        j.target_id, 
        j.factory_id
      FROM jobs j
      INNER JOIN (
          SELECT batch_id, MAX(createdAt) AS max_created
          FROM job_status
          GROUP BY batch_id
      ) latest_status 
          ON j.job_id = latest_status.batch_id
      INNER JOIN job_status js 
          ON js.batch_id = latest_status.batch_id 
         AND js.createdAt = latest_status.max_created
      WHERE js.status = 'active'
    `);

    res.json(jobs);

  } catch (error) {
    console.error('Get active jobs error:', error);
    res.status(500).json({
      message: 'Server error while fetching active jobs'
    });
  }
};

/* ---------------- GET JOBS WITH LATEST STATUS ---------------- */

export const getJobsWithLatestStatus = async (req, res) => {
  try {
    const [jobs] = await pool.query(`
      SELECT
        j.job_id,
        j.scheduled_start,
        j.scheduled_end,
        j.actual_start,
        j.actual_end,
        j.manager_id,
        j.createdAt,
        j.updatedAt,
        j.target_id,
        j.factory_id,
        js.status AS latest_status
      FROM jobs j
      LEFT JOIN (
        SELECT batch_id, status, createdAt
        FROM job_status
        WHERE (batch_id, createdAt) IN (
          SELECT batch_id, MAX(createdAt)
          FROM job_status
          GROUP BY batch_id
        )
      ) js 
        ON j.job_id = js.batch_id
    `);

    res.json(jobs);

  } catch (error) {
    console.error('Jobs with latest status error:', error);
    res.status(500).json({
      message: 'Server error while fetching jobs with latest status'
    });
  }
};
