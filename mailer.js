var nodemailer=require('nodemailer');
let mailTransporter=nodemailer.createTransport({
   service:"gmail",
    auth:{
        user:"noreplay.quickreport@gmail.com",
        pass:"33130212"

    }
})
var i=0,otp;
function GenerateOtp()
{
    otp=Math.floor(Math.random()*10000);
}
let details={
    Form:"noreplay.quickreport@gmail.com",
    to:"rajeshpareekdigitel@gmail.com",
    subject:"Email Varification",
    text:`Welcome To Quick Report `,
    html:`<h1>Welcome To Quick Report </h1><br> Your Email Varification Code <b>${otp}</b>`

}
setTimeout(()=>{
    GenerateOtp()
},900)

setInterval(() => {
    mailTransporter.sendMail(details,(err)=>{
        
        if(err)
        {
            console.log("have an error!")
            console.log(err);
        }
        else{
            console.log("mail has been sended successfully ")
        }
        })
        console.log(i);
        i++;
},1000 );