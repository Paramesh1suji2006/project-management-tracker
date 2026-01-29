# Project Management & Bug Tracker

A full-stack MERN application for project management and bug tracking with Kanban boards, real-time collaboration, and role-based access control.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Manager, Developer, Viewer)
  - Secure password hashing with bcrypt

- **Project Management**
  - Create, edit, and delete projects
  - Team member management
  - Project-based organization

- **Kanban Board**
  - Drag-and-drop ticket management
  - Three columns: To Do, In Progress, Done
  - Real-time status updates

- **Ticket Management**
  - Create and assign tickets
  - Set priorities (Low, Medium, High)
  - Rich ticket details with descriptions
  - Comments on tickets

- **Advanced Features**
  - Search and filter tickets
  - User profiles
  - Responsive design
  - Dark theme with glassmorphism

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- React Beautiful DnD

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt

## 📁 Project Structure

```
proj/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── server/          # Node.js backend
    ├── config/
    ├── models/
    ├── routes/
    ├── controllers/
    ├── middleware/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
```bash
cd proj
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the backend server**
```bash
cd server
npm run dev
```

3. **Start the frontend (in a new terminal)**
```bash
cd client
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👤 User Roles

- **Admin**: Full access to all features, including deleting projects
- **Manager**: Can create and manage projects, assign tickets
- **Developer**: Can create and edit tickets, add comments
- **Viewer**: Read-only access to projects and tickets

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin, Manager)
- `PUT /api/projects/:id` - Update project (Admin, Manager)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Tickets
- `GET /api/tickets` - Get all tickets (with filters)
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `PUT /api/tickets/:id/status` - Update ticket status

### Comments
- `GET /api/comments?ticketId=` - Get comments for ticket
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

## 🎨 UI Features

- Modern dark theme with gradient accents
- Glassmorphism effects
- Smooth animations and transitions
- Fully responsive design
- Toast notifications
- Modal dialogs
- Loading states

## 🔒 Security

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based authorization
- CORS enabled
- Helmet for security headers

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder

### Backend (Render/Railway)
1. Set environment variables
2. Deploy from Git repository

### Database (MongoDB Atlas)
1. Create a cluster
2. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize!

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ using the MERN stack
