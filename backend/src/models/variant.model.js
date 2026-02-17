import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';


const Variant = sequelize.define('Variant', {
  variant_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  variant_name: DataTypes.STRING,
  description: DataTypes.TEXT,
  version_code: DataTypes.STRING
}, {
  tableName: 'variants',
  timestamps: false
});


export default Variant;
