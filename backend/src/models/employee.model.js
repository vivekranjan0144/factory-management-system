import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },

  department_id: {                     // ✅ REQUIRED
    type: DataTypes.INTEGER,
    allowNull: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true
  },

  role: {
    type: DataTypes.STRING,
    allowNull: true
  },

  contact_number: {
    type: DataTypes.STRING,
    allowNull: true
  },

  joining_date: {
    type: DataTypes.DATE,
    allowNull: true
  },

  factory_location_id: {                        // ✅ REQUIRED
    type: DataTypes.INTEGER,
    allowNull: true
  }

}, {
  tableName: 'employee',
  timestamps: false
});

export default Employee;
