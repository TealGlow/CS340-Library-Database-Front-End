var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_comstoal',
  password        : '5511',
  database        : 'cs340_comstoal'
});
module.exports.pool = pool;
