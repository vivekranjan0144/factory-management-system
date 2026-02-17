import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
const Material = sequelize.define('Material', {
  material_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  uom: DataTypes.STRING,
  reorder_level: DataTypes.INTEGER,
  storage_temperature: DataTypes.DECIMAL
}, {
  tableName: 'materials',
  timestamps: false
});



export default Material;
