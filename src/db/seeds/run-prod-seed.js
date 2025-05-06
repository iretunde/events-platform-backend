const seed = require('./prodSeed');
const db = require('../../connection');

// Import the async getUsers function
const getUsers = require('../data/prodData/users');
const events = require('../data/prodData/events');
const signUps = require('../data/prodData/signUps');

getUsers()
  .then((users) => {
    return seed(users, events, signUps);
  })
  .then(() => {
    console.log('🌱 Production seed complete.');
    return db.end();
  })
  .catch((err) => {
    console.error('❌ Error seeding production DB:', err);
    db.end();
  });
