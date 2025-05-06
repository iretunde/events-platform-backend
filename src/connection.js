const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
} else if (ENV === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.production') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing. Please define it in your .env file!');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing. Please define it in your .env file!');
  process.exit(1);
}

// Add this config object
const config =
  ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        connectionString: process.env.DATABASE_URL,
      };

const pool = new Pool(config);

module.exports = pool;
