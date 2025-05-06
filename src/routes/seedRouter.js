const express = require('express');
const router = express.Router();

const seed = require('../db/seeds/prodSeed');
const getUsers = require('../db/data/prodData/users');
const events = require('../db/data/prodData/events');
const signUps = require('../db/data/prodData/signUps');

router.post('/seed-prod', async (req, res) => {
  try {
    const users = await getUsers();
    await seed(users, events, signUps);
    res.status(200).send('✅ Seeded production database!');
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).send('❌ Failed to seed production database');
  }
});

module.exports = router;