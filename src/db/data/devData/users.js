const bcrypt = require('bcrypt');

const getUsers = async () => {
  const users = [];

  const realPassword = 'Password123!';
  const realHash = await bcrypt.hash(realPassword, 10);
  const fakeHash = await bcrypt.hash('FakePassword456', 10);

  // Main admin
  users.push({
    first_name: 'Admin',
    last_name: 'User',
    email: 'eventsplatformuser1@gmail.com',
    role: 'admin',
    password_hash: realHash
  });

  // Owner
  users.push({
    first_name: 'Owner',
    last_name: 'User',
    email: 'ownereventsplatform@gmail.com',
    role: 'owner',
    password_hash: realHash
  });

  // Dummy admins
  for (let i = 3; i <= 5; i++) {
    users.push({
      first_name: `Admin${i}`,
      last_name: 'User',
      email: `admin${i}@example.com`,
      role: 'admin',
      password_hash: realHash
    });
  }

  // Dummy customers
  for (let i = 6; i <= 52; i++) {
    users.push({
      first_name: `First${i}`,
      last_name: `Last${i}`,
      email: `user${i}@example.com`,
      role: 'customer',
      password_hash: fakeHash
    });
  }

  return users;
};

module.exports = getUsers;
