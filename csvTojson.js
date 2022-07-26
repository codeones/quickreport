// TO CONVERT CSV FILE INTO JSON 
const cnn = require('./connection')
const { json } = require('body-parser')
const csvtojson = require('csvtojson');
const { set } = require('forever/lib/forever/cli');
const csvfilepath = "trade3month.csv"

// id: '623f5b2b87b4cb0001ed96b0',
//     clientOid: '',
//     symbol: 'ZIL-USDT',
//     side: 'sell',
//     type: 'limit',
//     stopPrice: '0',
//     price: '0.0641',
//     size: '72',
//     dealSize: '72',
//     dealFunds: '4.6152',
//     averagePrice: '0.0641',
//     fee: '0.0046152',
//     feeCurrency: 'USDT',
//     remark: '',
//     tags: '',
//     orderStatus: 'done',
//     field18: ''

var AssetSymbol = []
var RemoveUSDT, assetprice, filledunits, buycost, sellcost, orderside;
var CSVfinalArray = []



csvtojson()
    .fromFile(csvfilepath)
    .then((JsonDATA) => {
        // console.log(JsonDATA)
        for (var object of JsonDATA) {
            Symbol = object.symbol;
            assetprice = object.price
            assetprice = parseFloat(assetprice)
            filledunits = object.size;
            orderside = object.side
            buycost = object.funds
            console.log(object)

            // console.log(Symbol.match(/-USDT/))
            if (Symbol != "WAXP-USDT" && Symbol != "RSR-USDT" && Symbol != "EWT-USDT" && Symbol != "CTSI-USDT" && Symbol != "CWEB-USDT" && Symbol != "KDA-USDT" && Symbol != "UTK-USDT" && Symbol != "WAX-USDT" && Symbol != "MOVR-USDT" && Symbol != "VIDT-USDT") {
                if (Symbol.match(/-USDT/)) {
                    // console.log('TRUE !!!!!!!!!!!!!!!!!11')
                    Symbol = String(Symbol)
                    // console.log("SYMBOL BEFORE  REMOVING USDT :", RemoveUSDT)
                    RemoveUSDT = Symbol.replace("-", "")
                    // console.log("SYMBOL AFTER REMOVING USDT :", RemoveUSDT)
                    // console.log(RemoveUSDT)
                    AssetSymbol.push(RemoveUSDT)
                    // BaseAsset.push('USD')
                }
                if (orderside == "sell") {
                    sellcost = parseFloat(buycost)
                    buycost = 0
                    filledunits = 0 - parseFloat(filledunits)
                }
                else if (orderside == "buy") {
                    sellcost = 0
                    buycost = parseFloat(buycost)
                    filledunits = parseFloat(filledunits)

                }

                // array1.push(`${Doc_coinname}`, `${Doc_orderType}`, Doc_price, Doc_units, Doc_totalCost, Doc_SellCost)
                // mainArray.push(array1)
                console.log(`price :${assetprice} ,, SYMBOL : ${Symbol} ,,ORDER TYPE : ${orderside} ,, FILLED UNITS : ${filledunits}`)
                var CSVlocalArray = [];
                CSVlocalArray.push(`${RemoveUSDT}`, `${orderside}`, assetprice, filledunits, buycost, sellcost)
                console.log(`${RemoveUSDT}`, `${orderside}`, assetprice, filledunits, buycost, sellcost)
                console.log(CSVlocalArray)
                CSVfinalArray.push(CSVlocalArray)
            }
            // console.log(CSVfinalArray)
        }

    })



setTimeout(() => {
    var Sq = `INSERT INTO portfolio (Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES ?`
    cnn.query(Sq, [CSVfinalArray], (err, result) => {
        if (err) console.log(err)
        console.log(result)
    })
}, 1000)
