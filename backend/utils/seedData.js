const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Member.deleteMany();
    await Trainer.deleteMany();
    await Class.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    console.log('Data cleared');

    // Create Admin User
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@21cfitness.com',
      password: 'admin123',
      role: 'Admin'
    });

    console.log('Admin created');

    // Create Trainers
    const trainer1User = await User.create({
      username: 'trainer1',
      email: 'john.trainer@21cfitness.com',
      password: 'trainer123',
      role: 'Trainer'
    });

    const trainer1 = await Trainer.create({
      userId: trainer1User._id,
      name: 'John Smith',
      specialization: ['Yoga', 'Pilates', 'Flexibility'],
      contact: '555-0101',
      bio: 'Certified yoga instructor with 10 years of experience',
      certifications: ['RYT-500', 'Pilates Instructor'],
      availability: [
        { day: 'Monday', startTime: '06:00', endTime: '12:00' },
        { day: 'Wednesday', startTime: '06:00', endTime: '12:00' },
        { day: 'Friday', startTime: '06:00', endTime: '12:00' }
      ]
    });

    const trainer2User = await User.create({
      username: 'trainer2',
      email: 'sarah.trainer@21cfitness.com',
      password: 'trainer123',
      role: 'Trainer'
    });

    const trainer2 = await Trainer.create({
      userId: trainer2User._id,
      name: 'Sarah Johnson',
      specialization: ['HIIT', 'Cardio', 'Weight Training'],
      contact: '555-0102',
      bio: 'High-intensity training specialist',
      certifications: ['NASM-CPT', 'HIIT Specialist'],
      availability: [
        { day: 'Tuesday', startTime: '14:00', endTime: '20:00' },
        { day: 'Thursday', startTime: '14:00', endTime: '20:00' },
        { day: 'Saturday', startTime: '08:00', endTime: '14:00' }
      ]
    });

    console.log('Trainers created');

    // Create Members
    const member1User = await User.create({
      username: 'member1',
      email: 'jane.member@21cfitness.com',
      password: 'member123',
      role: 'Member'
    });

    const member1 = await Member.create({
      userId: member1User._id,
      name: 'Jane Doe',
      phone: '555-0201',
      address: '123 Main St, City',
      membershipType: 'Monthly',
      emergencyContact: {
        name: 'John Doe',
        phone: '555-0202'
      },
      status: 'Active'
    });

    const member2User = await User.create({
      username: 'member2',
      email: 'mike.member@21cfitness.com',
      password: 'member123',
      role: 'Member'
    });

    const member2 = await Member.create({
      userId: member2User._id,
      name: 'Mike Wilson',
      phone: '555-0203',
      address: '456 Oak Ave, City',
      membershipType: 'Quarterly',
      emergencyContact: {
        name: 'Sarah Wilson',
        phone: '555-0204'
      },
      status: 'Active'
    });

    const member3User = await User.create({
      username: 'member3',
      email: 'emily.member@21cfitness.com',
      password: 'member123',
      role: 'Member'
    });

    const member3 = await Member.create({
      userId: member3User._id,
      name: 'Emily Brown',
      phone: '555-0205',
      address: '789 Pine Rd, City',
      membershipType: 'Annual',
      emergencyContact: {
        name: 'Tom Brown',
        phone: '555-0206'
      },
      status: 'Active'
    });

    console.log('Members created');

    // Create Classes
    const class1 = await Class.create({
      name: 'Morning Yoga',
      trainerId: trainer1._id,
      schedule: [
        { day: 'Monday', startTime: '07:00', endTime: '08:00' },
        { day: 'Wednesday', startTime: '07:00', endTime: '08:00' },
        { day: 'Friday', startTime: '07:00', endTime: '08:00' }
      ],
      maxCapacity: 15,
      currentBookings: 0,
      durationMinutes: 60,
      description: 'Start your day with energizing yoga practice',
      difficulty: 'Beginner'
    });

    const class2 = await Class.create({
      name: 'HIIT Training',
      trainerId: trainer2._id,
      schedule: [
        { day: 'Tuesday', startTime: '18:00', endTime: '19:00' },
        { day: 'Thursday', startTime: '18:00', endTime: '19:00' }
      ],
      maxCapacity: 12,
      currentBookings: 0,
      durationMinutes: 60,
      description: 'High-intensity interval training for maximum results',
      difficulty: 'Advanced'
    });

    const class3 = await Class.create({
      name: 'Pilates Core',
      trainerId: trainer1._id,
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '10:00' },
        { day: 'Friday', startTime: '09:00', endTime: '10:00' }
      ],
      maxCapacity: 10,
      currentBookings: 0,
      durationMinutes: 60,
      description: 'Strengthen your core with controlled movements',
      difficulty: 'Intermediate'
    });

    const class4 = await Class.create({
      name: 'Cardio Blast',
      trainerId: trainer2._id,
      schedule: [
        { day: 'Saturday', startTime: '10:00', endTime: '11:00' }
      ],
      maxCapacity: 20,
      currentBookings: 0,
      durationMinutes: 60,
      description: 'Fun cardio workout to burn calories',
      difficulty: 'Intermediate'
    });

    console.log('Classes created');

    // Create Sample Bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const booking1 = await Booking.create({
      memberId: member1._id,
      classId: class1._id,
      bookingDate: tomorrow,
      time: '07:00',
      status: 'Confirmed'
    });

    const booking2 = await Booking.create({
      memberId: member2._id,
      classId: class2._id,
      bookingDate: tomorrow,
      time: '18:00',
      status: 'Confirmed'
    });

    // Update class bookings count
    await Class.findByIdAndUpdate(class1._id, { $inc: { currentBookings: 1 } });
    await Class.findByIdAndUpdate(class2._id, { $inc: { currentBookings: 1 } });

    console.log('Bookings created');

    // Create Sample Payments with Sri Lankan Rupee amounts
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const nextQuarter = new Date();
    nextQuarter.setMonth(nextQuarter.getMonth() + 3);

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    // Monthly Membership: Rs 6,500
    await Payment.create({
      memberId: member1._id,
      amount: 6500.00,
      paymentDate: today,
      method: 'Card',
      transactionId: 'TXN001',
      status: 'Completed',
      renewalDate: nextMonth
    });

    // Quarterly Membership: Rs 18,000 (3 months)
    await Payment.create({
      memberId: member2._id,
      amount: 18000.00,
      paymentDate: today,
      method: 'Bank Transfer',
      transactionId: 'TXN002',
      status: 'Completed',
      renewalDate: nextQuarter
    });

    // Annual Membership: Rs 65,000 (12 months - discounted)
    await Payment.create({
      memberId: member3._id,
      amount: 65000.00,
      paymentDate: today,
      method: 'Card',
      transactionId: 'TXN003',
      status: 'Completed',
      renewalDate: nextYear
    });

    console.log('Payments created');
    console.log('✅ Seed data inserted successfully!');
    console.log('💰 Payment amounts in Sri Lankan Rupees (LKR):');
    console.log('   - Monthly: Rs 6,500.00');
    console.log('   - Quarterly: Rs 18,000.00');
    console.log('   - Annual: Rs 65,000.00');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();