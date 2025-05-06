const db = require('../connection');
const format = require('pg-format');

// Create/register a new user
exports.createUser = async ({ first_name, last_name, email, password_hash }) => {
  const { rows } = await db.query(
    `
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, first_name, last_name, email, role;
    `,
    [first_name, last_name, email, password_hash]
  );
  return rows[0];
};

// Authenticate user login
exports.authenticateUser = async ({ email }) => {
  const { rows } = await db.query(
    `
      SELECT * FROM users WHERE email = $1;
    `,
    [email]
  );
  
  return rows[0]; // Controller will handle password checking
};

// Change user password
exports.changePassword = async (user_id, newPasswordHash) => {
  const { rows } = await db.query(
    `
      UPDATE users
      SET password_hash = $1
      WHERE user_id = $2
      RETURNING user_id, email;
    `,
    [newPasswordHash, user_id]
  );
  return rows[0];
};

// Change user role
exports.changeRole = async (user_id, newRole) => {
  const { rows } = await db.query(
    `
      UPDATE users
      SET role = $1
      WHERE user_id = $2
      RETURNING user_id, email, role;
    `,
    [newRole, user_id]
  );
  return rows[0];
};

// Get all users (with optional role filter)
exports.getAllUsers = async (filters = {}) => {
  const { role } = filters;
  let baseQuery = 'SELECT user_id, first_name, last_name, email, role FROM users ORDER BY role';
  const values = [];

  if (role) {
    baseQuery += ' WHERE role = $1';
    values.push(role);
  }

  const { rows } = await db.query(baseQuery, values);
  return rows;
};

// Fetch user by email (for forgot-password)
exports.getUserByEmail = async (email) => {
  const { rows } = await db.query(
    `
      SELECT user_id, email FROM users WHERE email = $1;
    `,
    [email]
  );
  return rows[0];
};

// Fetch full user (including password_hash) by user_id
exports.getUserById = async (user_id) => {
  const { rows } = await db.query(
    `
      SELECT * FROM users WHERE user_id = $1;
    `,
    [user_id]
  );
  return rows[0];
};