/* modules */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const log = require('./src/middlewares/log');
const protect = require('./src/middlewares/auth');

/* routeurs */
const userRoutes = require('./src/routes/user.route');
const authRoutes = require('./src/routes/auth.route');
const annoncesRoutes = require('./src/routes/annonce.route');
const favorisRoutes = require('./src/routes/favoris.route');
const conversationsRoutes = require('./src/routes/conversations.route');

/* initialization */
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

/* webSocket */
io.on('connection', (socket) => {
    console.log('User connecté:', socket.id);

    socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
    });

    socket.on('disconnect', () => {
        console.log('User déconnecté:', socket.id);
    });
});

/* middlewares */
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(log);
app.use(helmet());
app.use(express.json());

/* routes publiques */
app.get("/", (req, res) => {
    res.json({
        message: "API active"
    });
});

app.use('/auth', authRoutes);
app.use('/annonces', annoncesRoutes);

/* routes protégées */
app.use(protect);
app.use('/users', userRoutes);
app.use('/favoris', favorisRoutes);
app.use('/conversations', conversationsRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});