const seed = require('./devSeed');
const db = require('../../connection');

const getUsers = require('../data/devData/users'); // ✅ note: getUsers is a function
const events = require('../data/devData/events');
const signUps = require('../data/devData/signUps');

getUsers()
  .then((users) => {
    return seed(users, events, signUps);
  })
  .then(() => {
    console.log('✅ Dev DB seeded successfully.');
    return db.end();
  })
  .catch((err) => {
    console.error('❌ Error seeding dev DB:', err);
    db.end();
  });
