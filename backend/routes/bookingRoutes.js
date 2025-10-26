const express = require('express');
const router = express.Router();
const {
  getBookings,
  createBooking,
  cancelBooking,
  getMyUpcomingBookings
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my/upcoming', getMyUpcomingBookings);

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.delete('/:id', cancelBooking);

module.exports = router;