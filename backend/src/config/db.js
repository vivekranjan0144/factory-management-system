import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const sslCert = fs.readFileSync(
  path.join(__dirname, '../../DigiCertGlobalRootG2.crt.pem')
);

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: sslCert
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
