const {
    getAllEvents,
    getSingleEvent,
    deleteEventById,
    createEvent,
  } = require('../models/eventsModel');
  
  // GET /api/events
  exports.fetchAllEvents = async (req, res, next) => {
    try {
      const filters = req.query; // category or created_by could be in query params
      const events = await getAllEvents(filters);
      res.status(200).send({ events });
    } catch (err) {
      next(err);
    }
  };
  
  // GET /api/events/:event_id
  exports.fetchSingleEvent = async (req, res, next) => {
    try {
      const { event_id } = req.params;
      const event = await getSingleEvent(event_id);
  
      if (!event) {
        return res.status(404).send({ msg: 'Event not found' });
      }
  
      res.status(200).send({ event });
    } catch (err) {
      next(err);
    }
  };
  
  // DELETE /api/events/:event_id
  exports.removeEvent = async (req, res, next) => {
    try {
      const { event_id } = req.params;
      const deletedEvent = await deleteEventById(event_id);
  
      if (!deletedEvent) {
        return res.status(404).send({ msg: 'Event not found' });
      }
  
      res.status(204).send(); // 204 = No Content (success, no body needed)
    } catch (err) {
      next(err);
    }
  };
  
  const jwt = require('jsonwebtoken'); // Make sure this is imported at the top

// POST /api/events
exports.addNewEvent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ msg: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const created_by = decoded.user_id;
    const { name, date, start_time, end_time, about, category } = req.body;

    if (!name || !date || !category) {
      return res.status(400).send({ msg: 'Missing required fields' });
    }

    const newEvent = await createEvent({
      name,
      date,
      start_time,
      end_time,
      about,
      category,
      created_by,
    });

    res.status(201).send({ event: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    next(err);
  }
};
