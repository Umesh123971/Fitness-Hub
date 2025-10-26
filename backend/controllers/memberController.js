const Member = require('../models/Member');
const User = require('../models/User');

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin)
exports.getMembers = async (req, res) => {
  try {
    const { status, membershipType, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (membershipType) query.membershipType = membershipType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await Member.find(query).populate('userId', 'username email').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private
exports.getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('userId', 'username email');

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create member
// @route   POST /api/members
// @access  Private (Admin)
exports.createMember = async (req, res) => {
  try {
    const { username, email, password, name, phone, membershipType, address, emergencyContact } = req.body;

    // Create user account
    const user = await User.create({
      username,
      email,
      password,
      role: 'Member'
    });

    // Create member profile
    const member = await Member.create({
      userId: user._id,
      name,
      phone,
      membershipType,
      address,
      emergencyContact
    });

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin/Member)
exports.updateMember = async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    // Check authorization
    if (req.user.role === 'Member' && member.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found' 
      });
    }

    // Delete user account
    await User.findByIdAndDelete(member.userId);
    
    // Delete member profile
    await member.deleteOne();

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