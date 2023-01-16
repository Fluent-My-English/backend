const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv")
dotenv.config()

const loginRoute = require('./router/auth/login');
const signupRoute = require('./router/auth/signup');
const otpRote = require('./router/auth/otp');
const getEmailAuth = require('./router/auth/getEmail');
const checkAuthRoute = require('./router/auth/checkAuth');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));



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

app.use('/api/auth/login', loginRoute);
app.use('/api/auth/signup', signupRoute);
app.use('/api/auth/otp', otpRote);
app.use('/api/auth/getemail', getEmailAuth);
app.use('/api/auth/checkauth', checkAuthRoute);









app.listen(port, () => {
  console.log(`Running Express Server On PORT ${port}`);
});
