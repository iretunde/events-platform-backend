const express = require('express');
const {
  fetchAllEvents,
  fetchSingleEvent,
  removeEvent,
  addNewEvent,
} = require('../controllers/eventsController');

const eventsRouter = express.Router();

// Base path will already be /api/events
eventsRouter.get('/', fetchAllEvents);
eventsRouter.get('/:event_id', fetchSingleEvent);
eventsRouter.delete('/:event_id', removeEvent);
eventsRouter.post('/', addNewEvent);

module.exports = eventsRouter;
