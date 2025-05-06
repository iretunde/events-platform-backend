const db = require('../../connection');
const format = require('pg-format');

const seedProd = async (users, events, signUps) => {

  // Seed USERS only if none exist
  const { rows: existingUsers } = await db.query('SELECT 1 FROM users LIMIT 1');
  if (existingUsers.length === 0) {
    const userValues = users.map(({ first_name, last_name, email, role, password_hash }) => [
      first_name,
      last_name,
      email,
      role,
      password_hash,
    ]);

    const insertUsers = format(
      `INSERT INTO users (first_name, last_name, email, role, password_hash) VALUES %L`,
      userValues
    );
    await db.query(insertUsers);
    console.log('✅ Inserted default users.');
  } else {
    console.log('🟡 Users already exist — skipping user insert.');
  }

  // Seed EVENTS
  const { rows: existingEvents } = await db.query('SELECT 1 FROM events LIMIT 1');
  if (existingEvents.length === 0) {
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

    const insertEvents = format(
      `INSERT INTO events (name, date, start_time, end_time, about, category, image_url, created_by) VALUES %L`,
      eventValues
    );
    await db.query(insertEvents);
    console.log('✅ Inserted default events.');
  } else {
    console.log('🟡 Events already exist — skipping event insert.');
  }

  // Seed SIGNUPS
  const { rows: existingSignUps } = await db.query('SELECT 1 FROM signups LIMIT 1');
  if (existingSignUps.length === 0) {
    const signUpValues = signUps.map(({ user_id, event_id, added_to_calendar }) => [
      user_id,
      event_id,
      added_to_calendar,
    ]);

    const insertSignUps = format(
      `INSERT INTO signups (user_id, event_id, added_to_calendar) VALUES %L`,
      signUpValues
    );
    await db.query(insertSignUps);
    console.log('✅ Inserted default signups.');
  } else {
    console.log('🟡 Signups already exist — skipping signup insert.');
  }

  console.log('✅ Finished safe production seed.');
};

module.exports = seedProd;
