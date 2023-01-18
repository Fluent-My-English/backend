const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");

const con = require("../../components/connection");
const dotenv = require("dotenv");
dotenv.config();


router.use((req, res, next) => {
  if (req.session.user) {
    req.session.destroy();
    res.send("already signup"); //****** output
  }
  else next();
});


// Sign up with email and password
// {
//     "email" : "ushanchamodbandara@gmail.com",
//     "first_time_password": "Uqj#1111",
//     "second_time_password": "Uqj#1111"
// }
router.post("/", (req, res) => {
  const { email, first_time_password, second_time_password } = req.body;
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let loverCase = /[a-z]/g;
  let upperCase = /[A-Z]/g;
  let number = /[0-9]/g;

  if (
    typeof email !== "undefined" &&
    typeof first_time_password !== "undefined" &&
    typeof second_time_password !== "undefined"
  ) {
    if (email === "") {
      res.send("condition error"); //****** output
      return false;
    } 
    
    else if (!email.match(mailFormat)) {
      res.send("condition error"); //****** output
      return false;
    } 
    
    else if (first_time_password.length < 5) {
      res.send("condition error"); //****** output
      return false;
    } 
    
    else if (
      !first_time_password.match(loverCase) ||
      !first_time_password.match(upperCase) ||
      !first_time_password.match(number)
    ) {
      res.send("condition error"); //****** output
      return false;
    } 
    
    else if (first_time_password === "") {
      res.send("condition error"); //****** output
      return false;
    } 
    
    else {
      if (first_time_password !== second_time_password) {
        res.status(400).send("password_not_match"); //****** output
        return false;
      } else {
        const sql_check_email_already_exists = `SELECT student_id FROM student WHERE student_email='${email}'`;
        con.query(sql_check_email_already_exists, (err, result) => {
          if (err) {
            res.status(502).send("database_error"); //****** output
            throw err;
          } else {
            if (result.length > 0) {
              res.status(200).send("email_already_exist"); //****** output
            } else {
              //Encrypt password
              bcrypt.genSalt(10, function (err, Salt) {
                bcrypt.hash(first_time_password, Salt, function (err, hash) {
                  if (err) {
                    throw err;
                  } else {
                    const sql_save_data_in_database = `INSERT INTO student(student_email, password) VALUES ('${email}','${hash}')`;
                    con.query(sql_save_data_in_database, (err, result) => {
                      if (err) {
                        res.status(502).send("database_error"); //****** output
                        throw err;
                      } else {
                        if (result.affectedRows === 1) {
                          res.send("sign up success"); //****** output
                        } else {
                          res.status(417).send("expectation_failed"); //****** output
                        }
                      }
                    });
                  }
                });
              });
            }
          }
        });
      }
    }
  } else {
    res.send("condition error"); //****** output
    return false;
  }
});







module.exports = router;
