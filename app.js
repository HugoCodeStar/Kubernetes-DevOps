var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs/promises');
const pgp = require('pg-promise')();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let counter = 0;

//const db = pgp("postgresql://postgres:postgres@localhost:5432/postgres")
const db = pgp(process.env.DATABASE_URL)

async function migrate(){
  await db.none("create table if not exists pingpong(id SERIAL primary key, pings integer)")
  data = await db.one("select count(pings) from pingpong")
  console.log(data)
  if (data.count == 0){
    db.none("insert into pingpong(pings) values(0)"
    )
  }
}

migrate()

app.get('/', async (req, res) => {
  data = await db.one("select pings from pingpong")
  console.log( await db.one("select pings from pingpong"))
  res.send(`Ping / Pong ${data.pings}`)
  await db.none("update pingpong set pings = pings + 1")
})


module.exports = app;
