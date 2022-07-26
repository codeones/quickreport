const axios = require('axios');


var c="USDT"
var aveagePNL=0
const name =new Array("BTC",'BICO','DOT','LINK','ICP');
    var buyprice =[69000,1,14,21,25];
    var cost=[500,100,200,400,300]
    var url="https://api.binance.com/api/v3/ticker/24hr?symbol=";
    var currentprice=[];
    var price;
    var gain=[];
    var Pchange,i=0;
    var pnlvalue=[];
    var val,valD;
    
   const loop= async()=> {
      
       for(var CoinName of name)
       { 
         const apidata=await axios(url+CoinName+c,)
        
   .then((response)=>{
             return response.data;
            //  console.log("API DATA :",apidata)

         })
         .then((FinalData)=>{
            
             price= FinalData.askPrice;
             const saveprice=async()=>{
                
                
           gain.push( await currentprice.push(price));
           
            //   console.log("PRICE INSIDE SAVEPRICE :",price)
            //   console.log("CurreTP INSIDE SAVEPRICE :",currentprice)
        Pchange=await parseFloat(((currentprice[i]-buyprice[i])/currentprice[i])*100 ).toFixed(2) ;
        val= await (Pchange*cost[i])/100
        valD=val+cost[i];
        console.log(FinalData.symbol)
        console.log("INvested :"+cost[i]+"Current Value ::"+valD)
        await gain.push(Pchange)
        console.log("PNL Dollor :",val)
        aveagePNL=await parseInt(aveagePNL)+ parseInt(Pchange)
        
             console.log("Save Price Colled")
             console.log("Change :"+Pchange)
             i++;
             console.log("------------------------------------------------------------------")
             }
             
             console.log()
saveprice();
aveagePNL=aveagePNL/
console.log(i)
         })
       }
   }
   loop();
   console.log(gain)
   


   

   