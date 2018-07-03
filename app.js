const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sse = require('./middlewares/sse');
const error = require('./middlewares/error');
const locationsRouter = require('./routes/locations');

const app = express();

app.use(sse);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/locations', locationsRouter);
app.use(error);

module.exports = app;





