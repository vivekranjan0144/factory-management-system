
import sequelize from '../config/sequelize.js';
import { DataTypes } from 'sequelize';


const Job = sequelize.define('Job', {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  job_name: DataTypes.STRING,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  status: DataTypes.STRING,
  remarks: DataTypes.TEXT
}, {
  tableName: 'jobs',
  timestamps: false
});

export default Job;
