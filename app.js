var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs/promises');

var app = express();

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pingpong.txt')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

async function writepingpong() {
    await fs.mkdir(directory, {recursive:true})
    const logString = `Ping / Pongs: ${counter}`
    await fs.writeFile(filePath, logString)
  }

let counter = 0;

app.get('/', (req, res) => {
  res.send(`pong ${counter}`)
  counter++
  writepingpong()
})


module.exports = app;
