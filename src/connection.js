const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'development';

// Load the correct .env file
if (ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
} else if (ENV === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.production') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

// Fail-fast if critical environment variables are missing
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing. Please define it in your .env file!');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing. Please define it in your .env file!');
  process.exit(1);
}

// Create and export the connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = pool;
