/* modules */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors')


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
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

/* middlewares */
app.use(log);
app.use(helmet());


app.use(express.json());

/* routes puliques*/
app.get("/", (req, res) => {
    res.json({
        message : "API active"
    });
});

app.use('/auth', authRoutes);
app.use('/annonces', annoncesRoutes);

/* routes avec auth */
app.use(protect);
app.use('/users', userRoutes);
app.use('/favoris', favorisRoutes);
app.use('/conversations', conversationsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});