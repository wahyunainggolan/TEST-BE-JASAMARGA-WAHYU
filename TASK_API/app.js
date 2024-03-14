require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const db = require('./models/index');

const indexRouter = require('./routes/index');
const employeeRouter = require('./routes/employee');
const employeeProfileRouter = require('./routes/employee_profile');
const employeeEduRouter = require('./routes/education');
const employeeFamRouter = require('./routes/employee_family');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/employee', employeeRouter);
app.use('/employee-profile', employeeProfileRouter);
app.use('/employee-education', employeeEduRouter);
app.use('/employee-family', employeeFamRouter);

module.exports = app;
