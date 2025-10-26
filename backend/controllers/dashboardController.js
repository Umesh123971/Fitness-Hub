const Member = require('../models/Member');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private (Admin)
exports.getDashboardSummary = async (req, res) => {
  try {
    // Total active members
    const totalActiveMembers = await Member.countDocuments({ status: 'Active' });

    // Classes today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const classesToday = await Class.countDocuments({
      'schedule.day': today
    });

    // Revenue this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const paymentsThisMonth = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const revenueThisMonth = paymentsThisMonth.length > 0 ? paymentsThisMonth[0].total : 0;

    // Available slots today
    const classesWithSchedule = await Class.find({ 'schedule.day': today });
    const availableSlots = classesWithSchedule.reduce((sum, cls) => {
      return sum + (cls.maxCapacity - cls.currentBookings);
    }, 0);

    // Monthly member signups (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySignups = await Member.aggregate([
      {
        $match: {
          joinDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$joinDate' },
            month: { $month: '$joinDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Most booked classes
    const mostBookedClasses = await Booking.aggregate([
      {
        $match: {
          status: 'Confirmed'
        }
      },
      {
        $group: {
          _id: '$classId',
          bookingCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      {
        $unwind: '$classInfo'
      },
      {
        $project: {
          className: '$classInfo.name',
          bookingCount: 1
        }
      }
    ]);

    // Expiring memberships (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const expiringMemberships = await Payment.countDocuments({
      renewalDate: {
        $gte: new Date(),
        $lte: nextWeek
      },
      status: 'Completed'
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalActiveMembers,
          classesToday,
          revenueThisMonth,
          availableSlots,
          expiringMemberships
        },
        charts: {
          monthlySignups,
          mostBookedClasses
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get trainer dashboard
// @route   GET /api/dashboard/trainer
// @access  Private (Trainer)
exports.getTrainerDashboard = async (req, res) => {
  try {
    const Trainer = require('../models/Trainer');
    const trainer = await Trainer.findOne({ userId: req.user.id });

    // My classes
    const myClasses = await Class.find({ trainerId: trainer._id });

    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await Booking.find({
      classId: { $in: myClasses.map(c => c._id) },
      bookingDate: { $gte: today, $lt: tomorrow },
      status: 'Confirmed'
    })
      .populate('memberId', 'name phone')
      .populate('classId', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalClasses: myClasses.length,
        todayBookings: todayBookings.length,
        classes: myClasses,
        bookings: todayBookings
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get member dashboard
// @route   GET /api/dashboard/member
// @access  Private (Member)
exports.getMemberDashboard = async (req, res) => {
  try {
    const member = await Member.findOne({ userId: req.user.id });

    // Upcoming bookings
    const upcomingBookings = await Booking.find({
      memberId: member._id,
      bookingDate: { $gte: new Date() },
      status: 'Confirmed'
    })
      .populate({
        path: 'classId',
        populate: { path: 'trainerId', select: 'name' }
      })
      .sort('bookingDate')
      .limit(5);

    // Recent payments
    const recentPayments = await Payment.find({ memberId: member._id })
      .sort('-paymentDate')
      .limit(3);

    // Next renewal
    const nextRenewal = await Payment.findOne({
      memberId: member._id,
      renewalDate: { $gte: new Date() }
    }).sort('renewalDate');

    res.status(200).json({
      success: true,
      data: {
        memberInfo: member,
        upcomingBookings,
        recentPayments,
        nextRenewal
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};