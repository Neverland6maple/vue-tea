const mysql = require('mysql');
let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'tea'
}); 
module.exports = connection;