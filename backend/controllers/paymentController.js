const Payment = require('../models/Payment');
const Member = require('../models/Member');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
exports.getPayments = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const payments = await Payment.find(query)
      .populate('memberId', 'name phone membershipType')
      .sort('-paymentDate');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('memberId', 'name phone email membershipType');

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Admin)
exports.createPayment = async (req, res) => {
  try {
    const { memberId, amount, method, transactionId } = req.body;

    // Get member
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    // Calculate renewal date based on membership type
    const currentDate = new Date();
    let renewalDate = new Date(currentDate);
    
    switch(member.membershipType) {
      case 'Monthly':
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;
      case 'Quarterly':
        renewalDate.setMonth(renewalDate.getMonth() + 3);
        break;
      case 'Annual':
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        break;
    }

    // Create payment
    const payment = await Payment.create({
      memberId,
      amount,
      method,
      transactionId,
      renewalDate
    });

    // Update member status
    member.status = 'Active';
    await member.save();

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get member's payment history
// @route   GET /api/payments/member/:memberId
// @access  Private
exports.getMemberPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ memberId: req.params.memberId }).sort('-paymentDate');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get expiring memberships
// @route   GET /api/payments/expiring
// @access  Private (Admin)
exports.getExpiringMemberships = async (req, res) => {
  try {
    const daysAhead = parseInt(req.query.days) || 7;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const expiringPayments = await Payment.find({
      renewalDate: {
        $gte: new Date(),
        $lte: futureDate
      },
      status: 'Completed'
    })
      .populate('memberId', 'name phone email membershipType')
      .sort('renewalDate');

    res.status(200).json({
      success: true,
      count: expiringPayments.length,
      data: expiringPayments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};