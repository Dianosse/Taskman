/* modules */
const express = require('express');

require('dotenv').config();

const log = require('./src/middlewares/log');

/* routeurs */


/* initialization */
const app = express();
const PORT = process.env.PORT || 3000;
app.use(log);

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        "ok" : true
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});