const { Router } = require("express");
const router = Router();

const con = require("../../components/connection");
const dotenv = require("dotenv");
dotenv.config();


router.use((req, res, next) => {
    if (req.session.user) next();
    else res.send("unauthorized request"); //****** output
  });
  
  // get email (use in get email to verify)
  // {
  //     "email" : "ushanchamodbandara@gmail.com"
  // }
  router.post("/", (req, res) => {
    const { student_id } = req.session.user;
    if(student_id){
      const sql_get_email = `SELECT student_email FROM student WHERE student_id=${student_id}`;
      con.query(sql_get_email, (err, result) => {
        if (err) {
          res.status(502).send("database_error"); //****** output
          throw err;
        } else {
          if (result.length === 1) {
            res.status(200).send({ email: result[0].student_email }); //****** output
          } else {
            res.status(417).send("expectation_failed"); //****** output
          }
        }
      });
    }
    else{
      res.status(400).send("bad_request"); //****** output
    }
  });

  module.exports = router;
