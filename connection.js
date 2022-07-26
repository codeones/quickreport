const { connect } = require('http2');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3175",
    database: "testdb"
})
// conn.query("select * from newUser where username='pankajpareek' AND password='331302'",(e,result)=>{
//     if(e)console.log(e);
// console.log(result[0].name)
// })
module.exports = conn; //to make variable importable 