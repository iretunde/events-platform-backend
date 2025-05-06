const db = require('../../connection');
const format = require('pg-format');

const seed = async (users, events, signUps) => {

  await db.query('DROP TABLE IF EXISTS signups;');
  await db.query('DROP TABLE IF EXISTS events;');
  await db.query('DROP TABLE IF EXISTS users;');

  // Create USERS table
  await db.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'owner')),
      password_hash TEXT NOT NULL
    );
  `);

  // Create EVENTS table
  await db.query(`
    CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      date DATE NOT NULL,
      start_time TIME,
      end_time TIME,
      about TEXT,
      category TEXT NOT NULL,
      image_url TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/512/4285/4285436.png',
      created_by INT REFERENCES users(user_id) ON DELETE SET NULL
    );
  `);

  // Create SIGNUPS table
  await db.query(`
    CREATE TABLE signups (
      signup_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
      added_to_calendar BOOLEAN DEFAULT false,
      UNIQUE (user_id, event_id)
    );
  `);

  // Insert Users
  const userValues = users.map(({ first_name, last_name, email, role, password_hash }) => [
    first_name,
    last_name,
    email,
    role,
    password_hash,
  ]);

  if (userValues.length) {
    const insertUsers = format(
      `INSERT INTO users (first_name, last_name, email, role, password_hash) VALUES %L`,
      userValues
    );
    await db.query(insertUsers);
  }

  // Insert Events
  const eventValues = events.map(({ name, date, start_time, end_time, about, category, image_url, created_by }) => [
    name,
    date,
    start_time,
    end_time,
    about,
    category,
    image_url,
    created_by,
  ]);

  if (eventValues.length) {
    const insertEvents = format(
      `INSERT INTO events (name, date, start_time, end_time, about, category, image_url, created_by) VALUES %L`,
      eventValues
    );
    await db.query(insertEvents);
  }

  // Insert Signups
  const signUpValues = signUps.map(({ user_id, event_id, added_to_calendar }) => [
    user_id,
    event_id,
    added_to_calendar,
  ]);

  if (signUpValues.length) {
    const insertSignUps = format(
      `INSERT INTO signups (user_id, event_id, added_to_calendar) VALUES %L`,
      signUpValues
    );
    await db.query(insertSignUps);
  }

};

module.exports = seed;
