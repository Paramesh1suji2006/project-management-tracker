import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import ticketRoutes from './routes/tickets.js';
import commentRoutes from './routes/comments.js';
import sprintRoutes from './routes/sprints.js';
import ticketLinkRoutes from './routes/ticketLinks.js';
import timeLogRoutes from './routes/timeLogs.js';
import labelRoutes from './routes/labels.js';
import notificationRoutes from './routes/notifications.js';
import activityRoutes from './routes/activities.js';
import releaseRoutes from './routes/releases.js';
import attachmentRoutes from './routes/attachments.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    process.env.FRONTEND_URL, // Production frontend URL (set in Render)
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/ticket-links', ticketLinkRoutes);
app.use('/api/time-logs', timeLogRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/attachments', attachmentRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Project Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
