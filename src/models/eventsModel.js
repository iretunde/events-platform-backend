const db = require('../connection');
const format = require('pg-format');

exports.getAllEvents = async (filters = {}) => {
  const { category, created_by } = filters;

  let baseQuery = `
    SELECT 
      event_id,
      name,
      date,
      TO_CHAR(start_time, 'HH24:MI') AS start_time,
      TO_CHAR(end_time, 'HH24:MI') AS end_time,
      about,
      category,
      image_url,
      created_by
    FROM events
  `;
  const conditions = [];
  const values = [];

  if (category) {
    conditions.push(`category = $${values.length + 1}`);
    values.push(category);
  }

  if (created_by) {
    conditions.push(`created_by = $${values.length + 1}`);
    values.push(created_by);
  }

  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  const { rows } = await db.query(baseQuery, values);
  return rows;
};

exports.getSingleEvent = async (id) => {
  const { rows } = await db.query(
    `
      SELECT 
        event_id,
        name,
        date,
        TO_CHAR(start_time, 'HH24:MI') AS start_time,
        TO_CHAR(end_time, 'HH24:MI') AS end_time,
        about,
        category,
        image_url,
        created_by
      FROM events
      WHERE event_id = $1;
    `,
    [id]
  );
  return rows[0];
};

exports.deleteEventById = async (id) => {
  const { rows } = await db.query(
    `
      DELETE FROM events
      WHERE event_id = $1
      RETURNING 
        event_id,
        name,
        date,
        TO_CHAR(start_time, 'HH24:MI') AS start_time,
        TO_CHAR(end_time, 'HH24:MI') AS end_time,
        about,
        category,
        image_url,
        created_by;
    `,
    [id]
  );
  return rows[0];
};

// Create a new event (no need for TO_CHAR here since this is insert)
exports.createEvent = async ({ name, date, start_time, end_time, about, category, created_by }) => {
  const { rows } = await db.query(
    `
      INSERT INTO events (name, date, start_time, end_time, about, category, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        event_id,
        name,
        date,
        TO_CHAR(start_time, 'HH24:MI') AS start_time,
        TO_CHAR(end_time, 'HH24:MI') AS end_time,
        about,
        category,
        image_url,
        created_by;
    `,
    [name, date, start_time, end_time, about, category, created_by]
  );
  return rows[0];
};
