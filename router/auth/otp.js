const { Router } = require("express");
const router = Router();
const transporter = require("../../components/email");

const otpGenerator = require("otp-generator");
const con = require("../../components/connection");
const dotenv = require("dotenv");
dotenv.config();


router.use((req, res, next) => {
    if(req.session.user) next();
    else res.status(401).send("unauthorized");
})

router.use((req, res, next) => {
  if(req.session.user.student_id){
    const sql = `SELECT verify_email FROM student WHERE student_id=${req.session.user.student_id}`;
    con.query(sql, (err, result) => {
        if(err) {
            res.status(502).send("database_error");
            throw err;
        }
        else {
           if(result[0].verify_email === 0) next();
           else res.status(400).send("Already_verified");
        }
    });
  }
  else{
    res.status(400).send("bad_request");
  }
})


// otp request
router.post("/", (req, res) => {
    const { email } = req.body;
  
    const { student_id } = req.session.user;
  
    if(typeof(email) !== "undefined") {
      const sql_get_email = `SELECT student_email FROM student WHERE student_id=${student_id}`;
      con.query(sql_get_email, (err, result) => {
        if (err) {
          res.status(502).send("database_error"); //****** output
          throw err;
        } else {
          if (result.length !== 1) {
            res.status(417).send("expectation_failed"); //****** output
          } else {
            const email_from_database = result[0].student_email; //****** output
            if (email_from_database !== email) {
              res.status(400).send("bad_request"); //****** output
            } else {
              // if 2 emails are same ?
              // Create otp
              const otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
              });
    
              // send otp to database
              const sql_send_otp = `INSERT INTO otp(email, opt, date_otp_created) VALUES ('${email}','${otp}','${new Date()}')`;
              con.query(sql_send_otp, (err, result) => {
                if (err) {
                  res.status(502).send("database_error"); //****** output
                  throw err;
                } else {
                  if (result.affectedRows === 1) {
                    // send otp to email
                    let mailOptions = {
                      from: " Fluent My English <uc.chamod.public@gmail.com>",
                      to: `${email}`,
                      subject: "OTP for Fluent My English",
                      text: `OTP : ${otp}`,
                    };
    
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                        res.status(500).send("email_can_not_send"); //****** output
                      } else {
                        //   console.log("Email sent: " + info.response);
                        res.status(200).send({ ID: result.insertId }); //****** output
                      }
                    });
                  } else {
                    res.status(417).send("expectation_failed"); //****** output
                  }
                }
              });
            }
          }
        }
      });
    }
    else {
      res.status(400).send("bad_request"); //****** output
    }
  });


  // verify otp
// {
  // "email" : ""
//     "otp" : 5609,
//     "otp_id":6
// }
router.post("/verifyotp", (req, res) => {
    const { otp, otp_id } = req.body;
    const { student_id } = req.session.user;
  
    if (typeof otp !== "undefined" && typeof otp_id !== "undefined") {
      const sql_get_data_from_otp = `SELECT * FROM otp WHERE otp_id=${otp_id}`;
      con.query(sql_get_data_from_otp, (err, result) => {
        if (err) {
          res.status(502).send("database_error"); //****** output
          throw err;
        } else {
          if (result.length === 1) {
            const otp_from_database = result[0].opt;
            const otp_create_date = new Date(result[0].date_otp_created);
            const now = new Date();
  
            if (now - otp_create_date < 300000) {
              if (otp_from_database === otp) {
                sql_update_verification_of_email = `UPDATE student SET verify_email=true, email_verify_date='${new Date()}' WHERE student_id=${student_id}`;
                con.query(sql_update_verification_of_email, (err, result) => {
                  if (err) {
                    res.status(502).send("database_error"); //****** output
                    throw err;
                  } else {
                    if (result.affectedRows === 1) {
                      res.send("email_verified"); //****** output
                    } else {
                      res.status(417).send("expectation_failed"); //****** output
                    }
                  }
                });
              } else {
                res.send("wrong_otp");
              }
            } else {
              res.send("otp_expired"); //****** output
            }
          } else {
            res.status(417).send("expectation_failed"); //****** output
          }
        }
      });
    } else {
      res.status(417).send("expectation_failed"); //****** output
    }
  });

  module.exports = router;