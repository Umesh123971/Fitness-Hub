#  Fitness Hub 🏋️‍♂️

A comprehensive fitness center management system built with the MERN stack (MongoDB, Express.js, React, Vite) and Tailwind CSS.

## 🌟 Features

### 👤 Multi-Role Authentication
- **Admin**: Full system access and management
- **Trainer**: Manage classes, view bookings, and track performance
- **Member**: Book classes, view membership, and track payments

### 📊 Admin Dashboard
- Real-time statistics and analytics
- Member management (CRUD operations)
- Trainer management
- Class scheduling and capacity management
- Payment tracking and revenue reports
- Expiring membership alerts

### 💪 Trainer Features
- View assigned classes
- Check upcoming bookings
- Manage class schedules
- View member attendance

### 🎯 Member Features
- Browse available classes
- Book fitness classes
- View membership status
- Payment history
- Upcoming bookings management

### 💳 Payment System
- Multiple payment methods (Card, Bank Transfer, Cash)
- Membership types: Monthly, Quarterly, Annual
- Payment tracking with transaction IDs
- Renewal date management
- **Currency**: Sri Lankan Rupees (LKR)

### 📅 Class Management
- Multiple class types (Yoga, HIIT, Pilates, Cardio)
- Difficulty levels (Beginner, Intermediate, Advanced)
- Schedule management
- Capacity tracking
- Real-time booking updates

## 💰 Pricing (Sri Lankan Rupees)

- **Monthly Membership**: Rs 6,500.00
- **Quarterly Membership**: Rs 18,000.00 (Save Rs 1,500)
- **Annual Membership**: Rs 65,000.00 (Save Rs 13,000)

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router** for navigation
- **date-fns** for date formatting

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** enabled

## 📁 Project Structure

```
21C-Fitness-Hub/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── trainerController.js
│   │   ├── classController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Member.js
│   │   ├── Trainer.js
│   │   ├── Class.js
│   │   ├── Booking.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── trainerRoutes.js
│   │   ├── classRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── TrainerDashboard.jsx
│   │   │   │   └── MemberDashboard.jsx
│   │   │   ├── members/
│   │   │   │   ├── MemberList.jsx
│   │   │   │   └── MemberForm.jsx
│   │   │   ├── trainers/
│   │   │   │   ├── TrainerList.jsx
│   │   │   │   └── TrainerForm.jsx
│   │   │   ├── classes/
│   │   │   │   ├── ClassList.jsx
│   │   │   │   ├── ClassForm.jsx
│   │   │   │   └── ClassSchedule.jsx
│   │   │   ├── bookings/
│   │   │   │   ├── BookingList.jsx
│   │   │   │   └── BookingForm.jsx
│   │   │   ├── payments/
│   │   │   │   └── PaymentList.jsx
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Toast.jsx
│   │   │   └── layout/
│   │   │       └── Layout.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── utils/
│   │   │       └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitness-hub
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 👥 Default User Credentials

After seeding the database, you can login with:

### Admin Account
- **Email**: admin@21cfitness.com
- **Password**: admin123

### Trainer Accounts
- **Email**: john.trainer@21cfitness.com
- **Password**: trainer123

- **Email**: sarah.trainer@21cfitness.com
- **Password**: trainer123

### Member Accounts
- **Email**: jane.member@21cfitness.com
- **Password**: member123

- **Email**: mike.member@21cfitness.com
- **Password**: member123

- **Email**: emily.member@21cfitness.com
- **Password**: member123

## 📋 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Trainers
- `GET /api/trainers` - Get all trainers
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/schedule` - Get class schedule
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/my/upcoming` - Get user's upcoming bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/member/:memberId` - Get member payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/expiring` - Get expiring memberships

### Dashboard
- `GET /api/dashboard/summary` - Get admin dashboard summary
- `GET /api/dashboard/trainer` - Get trainer dashboard
- `GET /api/dashboard/member` - Get member dashboard

## 🎨 UI Features

### Modern Design System
- Gradient backgrounds and cards
- Smooth animations and transitions
- Responsive design for all devices
- Custom scrollbars
- Loading states and skeletons
- Toast notifications
- Modal dialogs

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Warning**: Yellow/Orange
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- CORS configuration
- Input validation

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**21C Fitness Hub Team**

## 📧 Contact

For support or inquiries:
- Email: support@21cfitness.com
- Website: www.21cfitness.com

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database
- Express.js for the robust backend framework

---

**Made with ❤️ for fitness enthusiasts in Sri Lanka 🇱🇰**