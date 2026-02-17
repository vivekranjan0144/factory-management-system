import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Location = sequelize.define('Location', {
  rack_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  factory_location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  rack_name: DataTypes.STRING,
  description: DataTypes.TEXT,
  aisle_number: DataTypes.STRING,
  bin_label: DataTypes.STRING
}, {
  tableName: 'location',
  timestamps: false
});


export default Location;
