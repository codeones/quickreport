const { connect } = require('http2');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: "www.remotemysql.com",
    user: "lAKQV8LSMJ",
    password: "6HNz80BJfP",
    database: "lAKQV8LSMJ"
})
// conn.query("select * from newUser where username='pankajpareek' AND password='331302'",(e,result)=>{
//     if(e)console.log(e);
// console.log(result[0].name)
// })
module.exports = conn; //to make variable importable 
