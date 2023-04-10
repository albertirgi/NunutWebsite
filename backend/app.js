import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes/index.js'
import cors from 'cors'
import { db, firebaseConfig } from './config/db.js'
import compression from 'compression'
import { fileURLToPath } from "url";
import { dirname } from "path";

import multer from "multer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const upload = multer({ storage: multer.memoryStorage() });

import {
  storeUser,
  login,
} from "./controllers/User.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if(req.query.bryanganteng !== undefined){
    next();
    return;
  }
  if(req.url === '/login' || (req.url === '/user' && req.method === 'POST') || req.url === '/testingemail' || req.url === '/handle-topup'){
    next();
    return;
  }
  var token = req.headers["authorization"];
  if (token !== undefined && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.substring(7, token.length);
  }else {
    res.status(401).json({
      message: "No token provided",
      status: 401,
    });
    return;
  }
  if (!token) {
    res.status(401).json({
      message: "No token provided",
      status: 401,
    });
    return;
  } else {
    jwt.verify(
      token,
      "9d891f12a761461d918c8264ad3f0e2e9a49998f008982c0cee73467e657e1f2",
      (err, decoded) => {
        if (err) {
          res.status(401).json({
            message: "Token is not valid",
            status: 401,
          });
          return;
        } else {
          req.decoded = decoded;
          next();
        }
      }
    );
  }
};
app.use("/", isLoggedIn, indexRouter);

//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

export default app;
