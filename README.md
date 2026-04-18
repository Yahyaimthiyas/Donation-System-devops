# 🎗️ Charity Donation Platform

A comprehensive full-stack web application for managing charitable donations, drives, and fundraising campaigns. Built with React.js frontend and Node.js/Express.js backend with MongoDB database.

![Charity Platform](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.14.1-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-orange)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role System**: Donor, Beneficiary, and Admin roles
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Protected Routes**: Role-based access control for different user types
- **Session Management**: Persistent login sessions

### 🎯 Donation Management
- **Create Donation Drives**: Beneficiaries can create fundraising campaigns
- **Multiple Donation Types**: Support for both monetary and item donations
- **Drive Approval System**: Admin approval workflow for new drives
- **Real-time Updates**: Live notifications and updates using Socket.io

### 📊 Analytics & Reporting
- **Donation Statistics**: Comprehensive analytics dashboard for admins
- **Leaderboard System**: Top donors and most successful drives
- **Progress Tracking**: Real-time progress tracking for donation goals
- **Admin Dashboard**: Complete overview of platform activities

### 🔔 Notification System
- **Real-time Notifications**: Instant updates for donations and drive status
- **Email Notifications**: Automated email alerts for important events
- **In-app Notifications**: Centralized notification center

### 👥 User Management
- **User Profiles**: Detailed user profiles with donation history
- **Profile Management**: Users can update their information
- **Admin User Management**: Admins can manage all users

## 🛠️ Technology Stack

### Frontend
- **React.js 19.1.0**: Modern UI library for building interactive interfaces
- **React Router DOM 7.5.3**: Client-side routing
- **Styled Components 6.1.17**: CSS-in-JS styling solution
- **Axios 1.9.0**: HTTP client for API communication
- **Socket.io Client 4.8.1**: Real-time communication
- **React Icons 5.5.0**: Icon library
- **Lucide React 0.506.0**: Modern icon set

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js 5.1.0**: Web application framework
- **MongoDB 8.14.1**: NoSQL database
- **Mongoose 8.14.1**: MongoDB object modeling
- **Socket.io 4.8.1**: Real-time bidirectional communication
- **JWT 9.0.2**: JSON Web Token authentication
- **bcryptjs 3.0.2**: Password hashing
- **Express Validator 7.2.1**: Input validation
- **CORS 2.8.5**: Cross-origin resource sharing

## 📁 Project Structure

```
donation-system/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS styles
│   └── package.json
├── config/                # Database configuration
├── middleware/            # Custom middleware
├── models/               # MongoDB schemas
├── routes/               # API route handlers
├── server.js            # Main server file
└── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/donation-system.git
cd donation-system
```

### Step 2: Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Environment Setup

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/charity
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 4: Database Setup
```bash
# Start MongoDB service
mongod

# Or if using MongoDB Atlas, update the MONGODB_URI in .env
```

### Step 5: Run the Application

#### Development Mode
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend development server
cd client
npm start
```

#### Production Mode
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### Step 6: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📖 Usage

### 1. User Registration & Login
- Navigate to `/register` to create a new account
- Choose your role: Donor, Beneficiary, or Admin
- Login with your credentials at `/login`

### 2. For Donors
- Browse available donation drives at `/drives`
- Make monetary or item donations
- Track your donation history in your profile
- View leaderboard rankings

### 3. For Beneficiaries
- Create new donation drives at `/create-drive`
- Manage your drives at `/my-drives`
- Update drive information and add progress updates
- Receive notifications for new donations

### 4. For Admins
- Approve or decline new drives at `/admin`
- View platform statistics at `/statistics`
- Monitor user activities and donation trends
- Manage the leaderboard

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Drives
- `GET /api/drives` - Get all approved drives
- `POST /api/drives` - Create new drive (Beneficiary only)
- `GET /api/drives/:id` - Get specific drive
- `PUT /api/drives/:id` - Update drive
- `DELETE /api/drives/:id` - Delete drive

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations/drive/:driveId` - Get donations for drive
- `GET /api/donations/user/:userId` - Get user donations

### Admin
- `GET /api/drives/pending` - Get pending drives (Admin only)
- `PUT /api/drives/:id/approve` - Approve drive (Admin only)
- `PUT /api/drives/:id/decline` - Decline drive (Admin only)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard data

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['donor', 'beneficiary', 'admin']),
  createdAt: Date
}
```

### Drive Model
```javascript
{
  title: String (required),
  description: String (required),
  images: [String],
  itemsNeeded: [String],
  monetaryGoal: Number,
  location: String (required),
  startDate: Date (required),
  endDate: Date (required),
  creator: ObjectId (ref: 'User'),
  status: String (enum: ['pending', 'approved', 'declined']),
  adminComment: String,
  updates: [{
    text: String,
    image: String,
    date: Date
  }],
  donations: [ObjectId (ref: 'Donation')],
  createdAt: Date
}
```

### Donation Model
```javascript
{
  donor: ObjectId (ref: 'User'),
  drive: ObjectId (ref: 'Drive'),
  type: String (enum: ['monetary', 'item']),
  amount: Number,
  items: [String],
  message: String,
  anonymous: Boolean,
  createdAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js community for the amazing framework
- MongoDB team for the robust database
- Socket.io for real-time communication capabilities
- All contributors and supporters of this project

## 📞 Support

If you have any questions or need support:
- Create an issue in the GitHub repository
- Contact the development team
- **Email**: yahyaimthiyas2005@gmail.com
- **Developer**: Yahya Imthiyas

---

**Made with ❤️ for making the world a better place through technology** 