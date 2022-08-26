const mysql = require('mysql');
let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'dhgssb&5728',
  database:'test'
}); 
module.exports = connection;