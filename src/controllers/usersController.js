const {
    createUser,
    authenticateUser,
    changePassword,
    changeRole,
    getAllUsers,
    getUserByEmail,
    getUserById
  } = require('../models/usersModel');
  
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const { sendResetEmail } = require('../utils/mailjet');  // import the email utility

  
  // POST /api/users/register
  exports.registerUser = async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;
  
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).send({ msg: 'Missing required fields' });
      }
  
      const password_hash = await bcrypt.hash(password, 10);
  
      const newUser = await createUser({
        first_name,
        last_name,
        email,
        password_hash
      });
  
      res.status(201).send({ user: newUser });
    } catch (err) {
      next(err);
    }
  };
  
  // POST /api/users/login
  exports.loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send({ msg: 'Missing email or password' });
      }
  
      const user = await authenticateUser({ email });
  
      if (!user) {
        return res.status(401).send({ msg: 'Invalid email' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!passwordMatch) {
        return res.status(401).send({ msg: 'Invalid password' });
      }
      

      const token = jwt.sign(
        {
          user_id: user.user_id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).send({ token, user: { role: user.role } });
    } catch (err) {

      next(err);
    }
  };
  
  // PATCH /api/users/:user_id/password
  exports.updatePassword = async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const { currentPassword, newPassword } = req.body;
  
      if (!currentPassword || !newPassword) {
        return res.status(400).send({ msg: 'Missing current or new password' });
      }
  
      const user = await getUserById(user_id);
      if (!user) {
        return res.status(404).send({ msg: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).send({ msg: 'Current password is incorrect' });
      }
  
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await changePassword(user_id, newPasswordHash);
  
      res.status(200).send({ msg: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  };
  
  // PATCH /api/users/reset-password/:token (for forgot password flow)
  exports.resetPasswordWithToken = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      if (!newPassword) {
        return res.status(400).send({ msg: 'Missing new password' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
      await changePassword(decoded.user_id, newPasswordHash);
  
      res.status(200).send({ msg: 'Password reset successfully' });
    } catch (err) {
      next(err);
    }
  };
  
  // POST /api/users/forgot-password

  exports.forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).send({ msg: 'Missing email' });
      }
  
      const user = await getUserByEmail(email);
  
      if (!user) {
        return res.status(404).send({ msg: 'User not found' });
      }
  
      const resetToken = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
  
      await sendResetEmail(user.email, user.first_name || 'User', resetToken);
  
      res.status(200).send({ msg: 'Reset link sent successfully' });
    } catch (err) {
      console.error('Forgot password error:', err);
      next(err);
    }
  };
  
  // PATCH /api/users/:user_id/role
  exports.updateRole = async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const { newRole } = req.body;
  
      if (!['customer', 'admin', 'owner'].includes(newRole)) {
        return res.status(400).send({ msg: 'Invalid role specified' });
      }
  
      await changeRole(user_id, newRole);
  
      res.status(200).send({ msg: 'User role updated successfully' });
    } catch (err) {
      next(err);
    }
  };
  
  // GET /api/users
  exports.fetchAllUsers = async (req, res, next) => {
    try {
      const filters = req.query;
      const users = await getAllUsers(filters);
      res.status(200).send({ users });
    } catch (err) {
      next(err);
    }
  };
  
// GET /api/users/:user_id
exports.fetchUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const user = await getUserById(user_id);

    if (!user) {
      return res.status(404).send({ msg: 'User not found' });
    }

    // You can remove password_hash before sending if it's sensitive
    const { password_hash, ...safeUser } = user;

    res.status(200).send({ user: safeUser });
  } catch (err) {
    next(err);
  }
};






  
