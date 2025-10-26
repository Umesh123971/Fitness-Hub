const express = require('express');
const router = express.Router();
const {
  getPayments,
  createPayment,
  getMemberPayments,
  getExpiringMemberships
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/expiring', authorize('Admin'), getExpiringMemberships);
router.get('/member/:memberId', getMemberPayments);

router.route('/')
  .get(authorize('Admin'), getPayments)
  .post(authorize('Admin'), createPayment);

module.exports = router;