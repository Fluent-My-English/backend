const mysql = require('mysql');
const dotenv = require("dotenv")
dotenv.config()

try{
  var con = mysql.createConnection({
      host: `localhost`,
      user: `root`,
      password: ``,
      database: `fluent_my_english`
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
}
catch{
  console.log("Can't connect DB..");
}

module.exports = con;
