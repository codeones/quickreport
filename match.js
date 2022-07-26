function matchString() {
    var string = "BTC-USDT,IOST-BTC";
    var result = string.match(/-USDT/);
    console.log("Output : " + result);
} matchString();