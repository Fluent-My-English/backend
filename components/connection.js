const mysql = require('mysql');
const dotenv = require("dotenv")
dotenv.config()

try{
  var con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
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
