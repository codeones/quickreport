const axios = require('axios')
var coinSymbol = "DOT"
const CmC = async () => {
    console.log(coinSymbol)
    await axios(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coinSymbol}`, {
        headers: {
            "X-CMC_PRO_API_KEY": "8f4e31a4-7094-45aa-aa06-b9f748555a98",
            "Accept": "application/json",
        },
    })
        .then((response) => {
            return response.data;
        })
        .then((FinalData) => {





            console.log(FinalData.data[`${coinSymbol}`][0]['quote']['USD'].price)
            // console.log("Coin Name :", CoinId)



        });

}
CmC()