const express = require("express")
var app = express()



app.get('/', (req, res) => {
    console.log("route hitted ")
    console.log(req)

})
app.listen(12000)