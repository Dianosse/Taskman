/* modules */
const express = require('express');
const helmet = require('helmet');


require('dotenv').config();

const log = require('./src/middlewares/log');
const auth = require('./src/middlewares/auth')

/* routeurs */
const userRoutes = require('./src/routes/user.routes')

/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;

/* middlewares */
app.use(log);
app.use(helmet());

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message : "API active"
    });
});

/* routes */
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});