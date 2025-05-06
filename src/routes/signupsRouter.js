const express = require('express');
const {
  signupForEvent,
  getEventSignups,
  getUserSignups,
  cancelSignup,
  addToCalendar,
} = require('../controllers/signupsController');

const signupsRouter = express.Router();

// User signs up for an event
signupsRouter.post('/', signupForEvent);

// Get all events a specific user is signed up for
signupsRouter.get('/user', getUserSignups);

// Get all users signed up to an event
signupsRouter.get('/:event_id', getEventSignups);

// Cancel a signup (user unsigns from an event)
signupsRouter.delete('/:event_id', cancelSignup);

// Mark that the event was added to the user's calendar
signupsRouter.patch('/:event_id/calendar', addToCalendar);

module.exports = signupsRouter;
