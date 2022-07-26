const express = require('express');
const app = express();
app.set('view engine','ejs')
app.use(express.static('public'));
app.set('views', '/app/public/')
function getdbinfo(name){
    //getinfo
    return info
}
app.get('/', async(req, res) =>{
    res.send("home/index",{req,getdbinfo})//Send a page with get info function.
})
app.listen(3000)