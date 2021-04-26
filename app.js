require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const axios = require('axios');

const directory = path.join(__dirname, 'public')
const filePath = path.join(directory, 'picsum.jpg')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'))

// https://stackoverflow.com/a/1349426
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const id = makeid(20)
const logString = `${new Date()} : ${id}`

setInterval(() => {
  console.log(logString)
}, 5000);

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const findAFile = async () => {
  if (await fileAlreadyExists()) return

  await new Promise(res => fs.mkdir(directory, (err) => res()))
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
  response.data.pipe(fs.createWriteStream(filePath))
}

app.get('/status', async (req, res) => {
  const pingpong = await axios.get('http://pingpong-svc:2346')
  console.log(pingpong)
  res.send(process.env.MESSAGE + '\n' + logString + '\n' + pingpong.data)
})

findAFile();

module.exports = app;