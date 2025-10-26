const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Member = require('../models/Member');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // Filter by role
    if (req.user.role === 'Member') {
      const member = await Member.findOne({ userId: req.user.id });
      query.memberId = member._id;
    } else if (req.user.role === 'Trainer') {
      // Get classes taught by this trainer
      const classes = await Class.find({ trainerId: req.user.id });
      query.classId = { $in: classes.map(c => c._id) };
    }

    const bookings = await Booking.find(query)
      .populate('memberId', 'name phone')
      .populate({
        path: 'classId',
        select: 'name durationMinutes',
        populate: { path: 'trainerId', select: 'name' }
      })
      .sort('-bookingDate');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('memberId', 'name phone email')
      .populate({
        path: 'classId',
        populate: { path: 'trainerId', select: 'name contact' }
      });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Member)
exports.createBooking = async (req, res) => {
  try {
    const { classId, bookingDate, time } = req.body;

    // Get member ID
    const member = await Member.findOne({ userId: req.user.id });
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member profile not found' 
      });
    }

    // Check member status
    if (member.status !== 'Active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your membership is not active. Please renew to book classes.' 
      });
    }

    // Get class
    const classData = await Class.findById(classId);
    
    if (!classData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    // Check capacity
    if (classData.currentBookings >= classData.maxCapacity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Class is fully booked' 
      });
    }

    // Create booking
    const booking = await Booking.create({
      memberId: member._id,
      classId,
      bookingDate,
      time
    });

    // Update class current bookings
    classData.currentBookings += 1;
    await classData.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already booked this class at this time' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (Member/Admin)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check authorization
    if (req.user.role === 'Member') {
      const member = await Member.findOne({ userId: req.user.id });
      if (booking.memberId.toString() !== member._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized' 
        });
      }
    }

    // Update booking status
    booking.status = 'Cancelled';
    await booking.save();

    // Decrease class current bookings
    const classData = await Class.findById(booking.classId);
    if (classData && classData.currentBookings > 0) {
      classData.currentBookings -= 1;
      await classData.save();
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get member's upcoming bookings
// @route   GET /api/bookings/my/upcoming
// @access  Private (Member)
exports.getMyUpcomingBookings = async (req, res) => {
  try {
    const member = await Member.findOne({ userId: req.user.id });

    const bookings = await Booking.find({
      memberId: member._id,
      bookingDate: { $gte: new Date() },
      status: 'Confirmed'
    })
      .populate({
        path: 'classId',
        populate: { path: 'trainerId', select: 'name' }
      })
      .sort('bookingDate');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};