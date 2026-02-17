import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {

  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  }

}, {
  tableName: 'users',
  timestamps: false
});

export default User;
