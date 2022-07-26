var express=require('express');
var app=express();
app.get('/',(req,res)=>{
    res.send("hiii")
    // res.links({  
    //     next: 'http://api.rnd.com/users?page=5',  
    //     last: 'http://api.rnd.com/users?page=10'  
    //   });  
})
app.listen(9000,function(e){
    if(e)
    console.log(e)
    else
    console.log('Success');

})