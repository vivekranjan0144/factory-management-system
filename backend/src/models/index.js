import sequelize from '../config/sequelize.js';

/* ---------- Import Models ---------- */

import FactoryLocation from './factoryLocation.model.js';
import Department from './department.model.js';
import Category from './category.model.js';
import Variant from './variant.model.js';
import Location from './location.model.js';
import Employee from './employee.model.js';
import Job from './job.model.js';
import Material from './material.model.js';
import User from './user.model.js';

/* ---------- Associations ---------- */

/* ✅ Category ↔ Variant */
Category.hasMany(Variant, { foreignKey: 'category_id' });
Variant.belongsTo(Category, { foreignKey: 'category_id' });

/* ✅ FactoryLocation ↔ Location */
FactoryLocation.hasMany(Location, { foreignKey: 'factory_location_id' });
Location.belongsTo(FactoryLocation, { foreignKey: 'factory_location_id' });

/* ✅ Department ↔ Employee */
Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

/* ✅ FactoryLocation ↔ Employee */
FactoryLocation.hasMany(Employee, { foreignKey: 'factory_location_id' });
Employee.belongsTo(FactoryLocation, { foreignKey: 'factory_location_id' });

/* ✅ Employee ↔ User (CRITICAL) */
Employee.hasOne(User, {
  foreignKey: 'employee_id',
  as: 'user'
});

User.belongsTo(Employee, {
  foreignKey: 'employee_id',
  as: 'employee'
});

/* ✅ Employee ↔ Job */
Employee.hasMany(Job, { foreignKey: 'employee_id' });
Job.belongsTo(Employee, { foreignKey: 'employee_id' });

/* ✅ Category ↔ Material */
Category.hasMany(Material, { foreignKey: 'category_id' });
Material.belongsTo(Category, { foreignKey: 'category_id' });

/* ✅ Variant ↔ Material */
Variant.hasMany(Material, { foreignKey: 'variant_id' });
Material.belongsTo(Variant, { foreignKey: 'variant_id' });

/* ❌ IMPORTANT: NO User ↔ FactoryLocation relation */
/* Because users table has NO factory_location_id column */

/* ---------- Export Models ---------- */

export {
  sequelize,
  FactoryLocation,
  Department,
  Category,
  Variant,
  Location,
  Employee,
  Job,
  Material,
  User
};
