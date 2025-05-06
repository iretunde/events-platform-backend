const express = require('express');
const {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPasswordWithToken,
  updateRole,
  fetchAllUsers,
  fetchUserById
} = require('../controllers/usersController');

const usersRouter = express.Router();

// Register a new user
usersRouter.post('/register', registerUser);

// Login user (returns token)
usersRouter.post('/login', loginUser);

// Forgot password (request password reset)
usersRouter.post('/forgot-password', forgotPassword);

// Reset password using token
usersRouter.patch('/reset-password/:token', resetPasswordWithToken);

// Update password normally (logged-in user)
usersRouter.patch('/:user_id/password', updatePassword);

// Update user's role (admin or owner)
usersRouter.patch('/:user_id/role', updateRole);

// Fetch all users (optionally filter by role)
usersRouter.get('/', fetchAllUsers);

//Fetch a specifc user
usersRouter.get('/:user_id', fetchUserById);


module.exports = usersRouter;
