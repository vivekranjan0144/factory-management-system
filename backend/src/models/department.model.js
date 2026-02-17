import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Department = sequelize.define('Department', {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  created_on: DataTypes.DATE,
  incharge_id: {
    type: DataTypes.INTEGER,
    unique: true
  }
}, {
  tableName: 'department',
  timestamps: false
});

export default Department;
