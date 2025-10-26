const Trainer = require('../models/Trainer');
const User = require('../models/User');

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate('userId', 'username email');

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single trainer
// @route   GET /api/trainers/:id
// @access  Private
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate('userId', 'username email');

    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trainer not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create trainer
// @route   POST /api/trainers
// @access  Private (Admin)
exports.createTrainer = async (req, res) => {
  try {
    const { username, email, password, name, specialization, contact, bio, certifications, availability } = req.body;

    // Create user account
    const user = await User.create({
      username,
      email,
      password,
      role: 'Trainer'
    });

    // Create trainer profile
    const trainer = await Trainer.create({
      userId: user._id,
      name,
      specialization,
      contact,
      bio,
      certifications,
      availability
    });

    res.status(201).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update trainer
// @route   PUT /api/trainers/:id
// @access  Private (Admin/Trainer)
exports.updateTrainer = async (req, res) => {
  try {
    let trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trainer not found' 
      });
    }

    // Check authorization
    if (req.user.role === 'Trainer' && trainer.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
// @access  Private (Admin)
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trainer not found' 
      });
    }

    // Delete user account
    await User.findByIdAndDelete(trainer.userId);
    
    // Delete trainer profile
    await trainer.deleteOne();

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