const fs=require('fs');
fs.writeFile('one.txt',"code id pasted",(errr,filedata)=>{
    if(errr) 
    {
        console.log(errr)
    }
    

})
fs.readFile('one.txt',"utf8",(err,data)=>{
if(err)
{console.log(err)

}
else{
    console.log(data)
}
})