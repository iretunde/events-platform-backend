const {
    createSignup,
    getSignupsByUserId,
    getSignupsByEventId,
    deleteSignup,
    markAddedToCalendar,
  } = require('../models/signupsModel');

  const jwt = require('jsonwebtoken');
 
// POST /api/signups
  exports.signupForEvent = async (req, res, next) => {
    try {
      const { event_id } = req.body;
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !event_id) {
        return res.status(400).send({ msg: 'Missing token or event_id' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.user_id;
  
      const signup = await createSignup({ user_id, event_id });
  
      res.status(201).send({ signup });
    } catch (err) {
      next(err);
    }
  };

 // GET /api/signups/user
exports.getUserSignups = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ msg: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    const userSignups = await getSignupsByUserId(user_id);

    res.status(200).send({ events: userSignups });
  } catch (err) {
    next(err);
  }
};
 


  
  // GET /api/signups/:event_id
  exports.getEventSignups = async (req, res, next) => {
    try {
      const { event_id } = req.params;
  
      const signups = await getSignupsByEventId(event_id);
  
      res.status(200).send({ signups });
    } catch (err) {
      next(err);
    }
  };
  
  // DELETE /api/signups/:event_id
  exports.cancelSignup = async (req, res, next) => {
    try {
      const { event_id } = req.params;
      const { user_id } = req.body;
  
      if (!user_id) {
        return res.status(400).send({ msg: 'Missing user_id' });
      }
  
      const deleted = await deleteSignup({ user_id, event_id });
  
      if (!deleted) {
        return res.status(404).send({ msg: 'Signup not found' });
      }
  
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
  
  // PATCH /api/signups/:event_id/calendar
  exports.addToCalendar = async (req, res, next) => {
    try {
      const { event_id } = req.params;
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !event_id) {
        return res.status(400).send({ msg: 'Missing token or event_id' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.user_id;
  
      const updated = await markAddedToCalendar({ user_id, event_id });
  
      if (!updated) {
        return res.status(404).send({ msg: 'Signup not found' });
      }
  
      res.status(200).send({ msg: 'Event added to calendar' });
    } catch (err) {
      next(err);
    }
  };
  