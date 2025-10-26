const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(authorize('Admin', 'Trainer'), getMembers)
  .post(authorize('Admin'), createMember);

router.route('/:id')
  .get(authorize('Admin', 'Trainer'), getMember)
  .put(authorize('Admin'), updateMember)
  .delete(authorize('Admin'), deleteMember);

module.exports = router;