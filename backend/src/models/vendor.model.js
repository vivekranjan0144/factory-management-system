import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('vendors', {
    vendor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    contact_info: DataTypes.STRING,
    gst_number: DataTypes.STRING,
    registration_date: DataTypes.DATE,
    rating: DataTypes.FLOAT,
  }, {
    timestamps: false,
  });
};
