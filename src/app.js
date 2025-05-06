const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const eventsRouter = require('./routes/eventsRouter'); 
const usersRouter = require('./routes/usersRouter')
const signupsRouter = require('./routes/signupsRouter');



const app = express();

// Global Middleware
app.use(express.json()); // Automatically parse incoming JSON

// CORS setup
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: 'https://yourfrontenddomain.com', // TODO: Replace with your my deployed frontend URL
  }));
} else {
  app.use(cors()); // Allow everything during development
}

app.use(helmet()); // Set secure HTTP headers

// Base routes
app.get('/', (req, res) => {
  res.status(200).send('Events Platform API is running!');
});


// Mount Routers
app.use('/api/events', eventsRouter); // All /api/events routes handled by eventsRouter
app.use('/api/users', usersRouter); // All /api/users routes handled by usersRouter
app.use('/api/signups', signupsRouter); // All /api/signups routes handled by signupsRouter

module.exports = app;
