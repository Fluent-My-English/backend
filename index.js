const express = require("express");
var cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv")
dotenv.config()

const signupRoute = require('./router/auth/signup');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());
app.use(cookieParser());

app.use(
  session({
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

// Print called API path
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use('/api/auth/signup', signupRoute);









app.listen(port, () => {
  console.log(`Running Express Server On PORT ${port}`);
});
