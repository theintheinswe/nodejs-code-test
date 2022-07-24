const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();

const apiRoutes = require('./routes/api');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.use((req, res, next) => {    
    res.status(500).send('Not Found!')
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.info(`API is listening on port: ${port}`);
});
