const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('trainerId', 'name specialization');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get class schedule
// @route   GET /api/classes/schedule
// @access  Private
exports.getClassSchedule = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('trainerId', 'name specialization')
      .select('name trainerId maxCapacity currentBookings durationMinutes schedule difficulty');

    // Organize by day
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    classes.forEach(cls => {
      cls.schedule.forEach(slot => {
        schedule[slot.day].push({
          classId: cls._id,
          className: cls.name,
          trainer: cls.trainerId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          duration: cls.durationMinutes,
          maxCapacity: cls.maxCapacity,
          currentBookings: cls.currentBookings,
          availableSpots: cls.maxCapacity - cls.currentBookings,
          difficulty: cls.difficulty
        });
      });
    });

    // Sort by time
    Object.keys(schedule).forEach(day => {
      schedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate('trainerId', 'name specialization contact');

    if (!classData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create class
// @route   POST /api/classes
// @access  Private (Admin)
exports.createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);

    res.status(201).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
exports.updateClass = async (req, res) => {
  try {
    let classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    classData = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Class not found' 
      });
    }

    await classData.deleteOne();

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
