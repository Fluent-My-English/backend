const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");

const con = require("../../components/connection");
const dotenv = require("dotenv");
dotenv.config();

router.use((req, res, next) => {
  if (req.session.user) res.send("already login"); //****** output
  else next();
});

// Sign up with email and password
// {
//     "email" : "ushanchamodbandara@gmail.com",
//     "password": "Uqj#1111",
// }

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "undefined" && typeof password !== "undefined") {
    const sql_check_email_already_exists = `SELECT student_id, student_email, password AS hashed FROM student WHERE student_email='${email}'`;
    con.query(sql_check_email_already_exists, (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length === 1) {
        bcrypt.compare(password, result[0].hashed, async (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            const student_id = result[0].student_id;
            req.session.user = { student_id };
            res.send(req.session); //****** output
          } else {
            res.send("password not match"); //****** output
          }
        });
      } else {
        res.send("email not found"); //****** output
      }
    });
  } else {
    res.send("condition error"); //****** output
    return false;
  }
});

module.exports = router;
