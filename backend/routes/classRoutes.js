const express = require('express');
const router = express.Router();
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getClassSchedule
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/schedule', getClassSchedule);

router.route('/')
  .get(getClasses)
  .post(authorize('Admin'), createClass);

router.route('/:id')
  .get(getClass)
  .put(authorize('Admin'), updateClass)
  .delete(authorize('Admin'), deleteClass);

module.exports = router;