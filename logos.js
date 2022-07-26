const axios = require('axios')

var coinSymbol = 'BTC'
var ImageSrc;
const CmC = async () => {

    await axios('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC', {
        headers: {
            "X-CMC_PRO_API_KEY": "8f4e31a4-7094-45aa-aa06-b9f748555a98",
            "Accept": "application/json",
        },
    })
        .then((response) => {
            return response.data;
        })
        .then((FinalData) => {

            // console.log(FinalData.data)
            console.log(FinalData.data[`${coinSymbol}`][0].symbol)
            console.log(FinalData.data[`${coinSymbol}`][0].name)
            console.log(FinalData.data[`${coinSymbol}`][0]['quote']['USD'].price)
            console.log("change :", FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_24h)
            console.log("change :", FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_7d)
            console.log("change :", FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_30d)
            console.log("change :", FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_90d)
            var CoinId = FinalData.data[`${coinSymbol}`][0].slug;
            console.log(CoinId)

            // console.log("Coin Name :", CoinId)
            Coingecko(CoinId)
        });

}
CmC()

const Coingecko = async (id) => {

    await axios(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&community_data=false&developer_data=false`)
        .then((response) => {
            return response.data;
        })
        .then((FinalData) => {

            console.log("COIN GECKO START")
            ImageSrc = FinalData.image.thumb;
            console.log(ImageSrc)


        });

}

















