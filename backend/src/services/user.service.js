import { User, Employee } from '../models/index.js';

export const findUserByEmail = async (email) => {
  try {
    if (!email) return null;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: { email: cleanEmail },

      include: [
        {
          model: Employee,
          as: 'employee',    // ✅ MUST MATCH index.js
          attributes: [
            'employee_id',
            'name',
            'role',
            'factory_location_id',
            'department_id'
          ]
        }
      ]
    });

    if (!user) return null;

    return {
      user_id: user.user_id,
      email: user.email,
      password_hash: user.password_hash,

      employee_id: user.employee.employee_id,
      name: user.employee.name,
      role: user.employee.role,
      factory_location_id: user.employee.factory_location_id,
      department_id: user.employee.department_id
    };

  } catch (err) {
    console.error('ORM error (findUserByEmail):', err.message);
    throw err;
  }
};
