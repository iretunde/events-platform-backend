const db = require('../connection');

// Create a new signup
exports.createSignup = async ({ user_id, event_id }) => {
  const { rows } = await db.query(
    `
      INSERT INTO signups (user_id, event_id)
      VALUES ($1, $2)
      RETURNING signup_id, user_id, event_id, added_to_calendar;
    `,
    [user_id, event_id]
  );
  return rows[0];
};

// Get all events a user is signed up for
exports.getSignupsByUserId = async (user_id) => {
  const { rows } = await db.query(
    `
      SELECT e.*, s.added_to_calendar
      FROM signups s
      JOIN events e ON s.event_id = e.event_id
      WHERE s.user_id = $1;
    `,
    [user_id]
  );
  return rows;
};

// Get all signups for a specific event
exports.getSignupsByEventId = async (event_id) => {
  const { rows } = await db.query(
    `
      SELECT s.signup_id, s.user_id, u.first_name, u.last_name, s.added_to_calendar
      FROM signups s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.event_id = $1;
    `,
    [event_id]
  );
  return rows;
};

// Delete a signup
exports.deleteSignup = async ({ user_id, event_id }) => {
  const { rows } = await db.query(
    `
      DELETE FROM signups
      WHERE user_id = $1 AND event_id = $2
      RETURNING signup_id;
    `,
    [user_id, event_id]
  );
  return rows[0];
};

// Mark signup as added to calendar
exports.markAddedToCalendar = async ({ user_id, event_id }) => {
  const { rows } = await db.query(
    `
      UPDATE signups
      SET added_to_calendar = true
      WHERE user_id = $1 AND event_id = $2
      RETURNING signup_id, added_to_calendar;
    `,
    [user_id, event_id]
  );
  return rows[0];
};

