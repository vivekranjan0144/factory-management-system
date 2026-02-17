import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const FactoryLocation = sequelize.define('FactoryLocation', {
  factory_location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  area_name: DataTypes.STRING,
  address: DataTypes.STRING,
  manager_name: DataTypes.STRING,
  contact_number: DataTypes.STRING
}, {
  tableName: 'factory_location',
  timestamps: false
});

export default FactoryLocation;
