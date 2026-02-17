import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('job_status', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    batch_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, {
    timestamps: false,
  });
};
