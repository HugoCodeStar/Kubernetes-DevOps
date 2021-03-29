var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'log.txt')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
let logString = ""

const getFile = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return console.log('FAILED TO READ FILE', '----------------', err)
    res(buffer)
  })
})

async function readlog() {
  const log = await getFile()
  logString = log.toString()
  console.log(logString)
}

app.get('/', (req, res) => {
  res.send(logString)
})

setInterval(async () => {
  await readlog()
}, 5000);



module.exports = app;
