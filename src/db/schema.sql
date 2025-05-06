
-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'owner')),
  password_hash TEXT NOT NULL
);

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
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

-- SIGNUPS TABLE
CREATE TABLE IF NOT EXISTS signups (
  signup_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
  added_to_calendar BOOLEAN DEFAULT false,
  UNIQUE (user_id, event_id)
);
