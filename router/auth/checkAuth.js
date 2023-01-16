const { Router } = require("express");
const router = Router();
const con = require("../../components/connection");

// check auth with it completed with email verification
router.post("/", (req, res) => {
  const { user } = req.session;
  if (user) {
    const { student_id } = user;

    if (student_id) {
      const sql = `SELECT verify_email FROM student WHERE student_id=${student_id}`;
      con.query(sql, (err, result) => {
        if (err) {
          throw err;
        } else {
            if(result.length > 0){
                const verify_email = result[0].verify_email;
                if (typeof verify_email !== "undefined") {
                  if (verify_email === 1)
                    res.send({ signup: true, emailVerify: true });
                  else res.send({ signup: true, emailVerify: false });
                } else {
                  res.send({ signup: false, emailVerify: false });
                }
            }
            else{
                res.send({ signup: false, emailVerify: false });
            }
        }
      });
    } else {
      res.send({ signup: false, emailVerify: false }); //****** output
    }
  } else {
    res.send({ signup: false, emailVerify: false });
  }
});

// check auth with it completed with email verification
router.post("/checkauthenticated", (req, res) => {
  const { user } = req.session;
  if (user) {
    res.send("authorized");
  } else {
    res.send("unauthorized");
  }
});

module.exports = router;
