const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer
} = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getTrainers)
  .post(authorize('Admin'), createTrainer);

router.route('/:id')
  .get(getTrainer)
  .put(authorize('Admin'), updateTrainer)
  .delete(authorize('Admin'), deleteTrainer);

module.exports = router;