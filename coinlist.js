var axios = require('axios')

const fs = require('fs');

var content;
axios.get('https://api3.binance.com/api/v3/ticker/price')
    .then(function (response) {
        console.log("hhhh", response.data.length)
        for (var i = 0; i < response.data.length; i++) {
            // console.log(response.data[i].id)
            var output = response.data[i].symbol
            if (output.match(/USDT/)) {
                content = `<option value="${response.data[i].symbol}"> ${response.data[i].symbol} </option> \r\n`
                // console.log(content)
                fs.appendFile('binanceCoinlist.txt', content, err => {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        // console.log("written ")
                    }
                    // file written successfully
                });
            }
            else {
                console.log("Not Match")
            }
        }

    })


