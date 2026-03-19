/* modules */
const express = require('express');
const helmet = require('helmet');


require('dotenv').config();

const log = require('./src/middlewares/log');
const protect = require('./src/middlewares/auth');

/* routeurs */
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.route');

/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;

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


/* routes avec auth */
app.use(protect);
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});