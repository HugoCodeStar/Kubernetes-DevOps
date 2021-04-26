var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs/promises');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let counter = 0;

app.get('/', (req, res) => {
  res.send(`Ping / Pong ${counter}`)
  counter++
})


module.exports = app;
