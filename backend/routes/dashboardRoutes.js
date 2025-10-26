const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getTrainerDashboard,
  getMemberDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/summary', authorize('Admin'), getDashboardSummary);
router.get('/trainer', authorize('Trainer'), getTrainerDashboard);
router.get('/member', authorize('Member'), getMemberDashboard);

module.exports = router;