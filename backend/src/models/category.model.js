import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  category_name: DataTypes.STRING,
  description: DataTypes.TEXT,
  is_active: DataTypes.BOOLEAN
}, {
  tableName: 'categories',
  timestamps: false
});

export default Category;
