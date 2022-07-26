const express = require("express");
const axios = require("axios");
const csvTojson = require("csvtojson")
const fs = require('fs')
const path = require('path')
const console = require('console');
const cnn = require("./connection");
var nodemailer = require('nodemailer');
const bodyparser = require("body-parser");
const app = express();
app.use(express.json())
const jwt = require('jsonwebtoken')
const session = require("express-session");
const { request, response } = require("express");
const { dirname } = require("path");
const conn = require("./connection");
const { stringify } = require("querystring");
const { SlowBuffer } = require("buffer");

const cookiesParser = require('cookie-parser')
app.use(bodyparser.json());
app.use(cookiesParser())
app.use(
    bodyparser.urlencoded({
        extended: true,
    })
);

app.set("view engine", "ejs");
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

// req.session.loggedin = false;
// req.session.loggedin = false;
var JsonWebTocken = "jwtt";
var userEmail;
var tablename;
var found;
var name;
var Dj;
const auth = async (req, res, next) => {
    if (JsonWebTocken == "jwtt") {
        res.redirect('/login')
    }
    else {
        var varification = jwt.verify(JsonWebTocken, "everydayisdefferentdaymakeitbestdayofyourlife")
        console.log(varification)
        console.log(req.cookies.JW)

        console.log(true)
        next()

    }


}
//register start
app.get('/user', (req, res) => {
    function DbOperationsForRegister() {
        var sql = "show databases"
        cnn.query(sql, (err, result) => {
            if (err) throw err;
            tables = result;
            console.log("Databases")
        })
    }
    if (req.session.loggedin) {
        res.render(__dirname + "/already", {
            username: tablename, userEmail, name, Current_Value, invested, b, Dj

        })
    }
    else {
        var tables;
        if (!cnn._connectCalled) {
            cnn.connect(function (err) {
                if (err) throw err;
                console.log("connected");
                DbOperationsForRegister(req, res); // function for database operations 

            })
        }
        else {
            DbOperationsForRegister()
        }
        res.render(__dirname + "/signin", { alltables: tables })
    }
})
//register END
//login Start


var i = 0, otp, status;
// Login Rout
var Users_name
app.get("/login", (req, res) => {
    if (!found) {
        res.sendFile(__dirname + "/login.html");
    }
    else {
        res.redirect('/user')
    }
});
var usernameorEmail;
app.post("/login", (req, res) => {
    function DbOperationsForLogin() {
        var sqllogin = `select *from newUsers WHERE username='${usernameorEmail}' AND password='${passwordlog}'`;
        // console.log(sqllogin);
        cnn.query('use testdb', (err, result) => {
            cnn.query(sqllogin, (err, resultl) => {
                if (err) throw err;
                // console.log("Email ID : ", userEmail)
                if (resultl.length > 0) {
                    tablename = usernameorEmail;
                    Users_name = resultl.name;
                    found = true;
                    status = resultl[0].varified;
                    userEmail = resultl[0].emailid;
                    name = resultl[0].name;
                    Dj = resultl[0].jdate;
                    const jwtGenerateTocken = async () => {
                        var tocken = jwt.sign({ username: usernameorEmail }, "everydayisdefferentdaymakeitbestdayofyourlife")
                        JsonWebTocken = tocken;
                        console.log(tocken);
                        res.cookie("JT", tocken)
                    }
                    jwtGenerateTocken()
                    // console.log(userEmail)
                    req.session.loggedin = true;

                    res.render(__dirname + "/loginsuccess", { name: tablename, Ustatus: status });
                } else {
                    res.sendFile(__dirname + "/notregistered.html");
                }
            })
        })
    }
    // console.log("BODY::::", req.body)
    usernameorEmail = req.body.usrName;
    passwordlog = req.body.Passlog;
    if (!cnn._connectCalled) {
        cnn.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            DbOperationsForLogin(req, res) //function for Database operations for login route
        }); //connection function call for first time handshake
    } else {
        DbOperationsForLogin(req, res) //call if handshake already done
    }
});
//Login End
//portfollio Start
app.get("/portfolio", (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login')
    } else {
        res.sendFile(__dirname + "/portfolio.html");
    }
});
var t = true;
app.post("/portfolio", (req, res) => {
    // console.log(req.body);
    var coinname = req.body.coinName;
    var base = req.body.base;
    var ordertype = req.body.ordertype;
    var price = req.body.price;
    var sellcost;
    if (price < 0.0001) {
        price = parseFloat(price).toFixed(6);
    } else {
        price = parseFloat(price).toFixed(3);
    }
    var unit = req.body.units;
    var total = req.body.totals;
    if (total < 0.0001) {
        total = parseFloat(total).toFixed(6);
    } else {
        total = parseFloat(total).toFixed(2);
    }
    if (ordertype == "SELL") {
        unit = 0 - unit;
        sellcost = total;
        total = 0


    } else {
        unit = unit;
        sellcost = 0
    }
    if (!cnn._connectCalled) {
        cnn.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            var sql = `INSERT INTO portfolio VALUES('${coinname}','${ordertype}',${price},${unit},${total},${sellcost})`;
            cnn.query(sql, (err, result) => {
                if (err) throw err;
                res.sendFile(__dirname + "/response.html");
            });
        });
    } else {
        var sql = `INSERT INTO portfolio VALUES('${coinname}','${ordertype}',${price},${unit},${total},${sellcost})`;
        cnn.query(sql, (err, results) => {
            if (err) throw err;
            res.sendFile(__dirname + "/response.html");
        });
    }
});
//Funding route start
app.get('/funding', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login')
    } else {
        res.sendFile(__dirname + "/MainFunding.html")
    }
})
// const lodingDashBord = () => {

// }
app.get('/News', (req, res) => {
    res.sendFile(__dirname + "/news.html")
})
app.post('/funding', (req, res) => {
    // console.log(req.body)
    var Amount = req.body.amount;
    var Ttype = req.body.type;
    var Tdiscription = req.body.Discription;
    var Tdate = req.body.date;
    if (Ttype == 'withdraw') {
        Amount = 0 - Amount;
    }
    console.log(Amount, Ttype, Tdiscription, Tdate)
    cnn.query(`use ${tablename}`, (err, result) => {
        if (err) console.log("FUnding insert err:", err)
        console.log(result)
        cnn.query(`insert into funding values('${Amount}','${Ttype}','${Tdiscription}','${Tdate}')`, (err, result) => {
            if (err) console.log(err)
            res.sendFile(__dirname + '/Fresponse.html')
        })
    })
})
//Funding route End
// OTP varification start
var sqlqr
app.post('/emailvarification', (request, response) => {
    var Iotp = request.body.userotp;
    console.log(userEmail);
    if (otp == Iotp) {
        conn.query(`update newuser SET varified=${t} where username='${resultl[0].username}'`, (e, result) => {
            if (e) console.log(e);
            // console.log(result)
            response.send(" Email Varification SuccessFull !");
            response.redirect('/dash-bord');
        })
    }
    else {
        response.send("Invalid OTP")
    }
})
function DbOperationAfterVarification() {
    var tbl = `CREATE TABLE portfolio(Coin_Name VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50),SELL_COST VARCHAR(50))`;
    var tbl2 = 'create table funding(amount varchar(50),type varchar(50),discription varchar (500), date varchar(50)) '
    cnn.query(`create database ${username}`, (err, result) => {
        if (err) console.log(err)
        cnn.query(`use  ${username}`, (err, result) => {
            cnn.query(tbl, (err, result) => {
                if (err) console.log(err)
                cnn.query(tbl2, (err, result) => {
                    if (err) console.log(err)

                })
            })
        })
    })

}

app.get('/reset', (req, res) => {
    cnn.query('truncate table portfolio', (err, result) => {
        if (err) console.log(err)
        res.redirect('/dash-bord')

    })
})
app.get('/v', (req, res) => {
    if (found) {
        conn.query(`update newUsers SET varified=true where username='${tablename}'`, (e, result) => {
            if (e) {
                res.sendFile(__dirname + "Err404.html")
            };
            // console.log('SET 1 RESULT :: ', result)
            if (result.affectedRows == 1) {
                DbOperationAfterVarification();
                res.sendFile(__dirname + "/EmailSuccess.html")
            }
        })
    }
    else {
        res.redirect('/login')
    }
})
app.get('/emailvarification', (request, response) => {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "noreplay.quickreport@gmail.com",
            pass: "33130212"
        }
    })
    otp = Math.floor(100000 + Math.random() * 900000);
    let details = {
        Form: "noreplay.quickreport@gmail.com",
        to: userEmail,
        subject: "Email Varification",
        text: `Welcome To Quick Report `,
        html: `<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300&amp;display=swap" rel="stylesheet">

    <title>Document</title>
</head>

<body style="background-color: black;">
   
        <h2
            style="color:white ;margin-bottom: -40px;margin-top: -15px; text-align: center;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            welcome , <p style="color: rgb(13, 213, 248);margin-top:-5px;font-weight: 300;">${name}</p>
        </h2>
        </h2><br>
        <P
            style="color:rgb(185, 181, 181) ;font-size: small; text-align: center;font-family: Arial, Helvetica, sans-serif">
            Registration Successfull please verify your
            email address .</P>
        
        <h2 style="font-family:'Source Serif 4', sans-serif;color: #f9d004;"> Your Email Varification Code</h2>
        <p
            style="color:#f8c704;background-color:rgb(13, 13, 13);box-shadow: rgb(249, 159, 4) 0px 0px 5px 0px; font-size:40px;margin: 10px;border-radius:50px;">
            ${otp}
        </p>
        <p style="color: rgb(243, 8, 8);">If This is not done by you . Ignore it .</p>
        <p style="text-align: left; font-weight: 900;color: rgb(171, 170, 170); font-size: large;">Regards </p>
        <p style="text-align: left; color: #9f9d97; margin-top:-15px ;margin-left: 15px;">Team QuickReport </p>
        <hr>
        <p>Powered By OrangeDevs</p>
    </div>
</body>`
    }
    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log("have an error!")
            console.log(err);
            response.send("Something Went Rong")
            response.redirect('/login')
        }
        else {
            // console.log("mail has been sended successfully ")
            response.render(__dirname + "/Emailvarify", { otp, userEmail })
        }
    })
    // response.send(`OTP:${otp}`)
})
//Varification end
//Logout Start
const sts = false;
app.get("/logout", (req, res) => {
    req.session.loggedin = false;
    found = false;
    res.sendFile(__dirname + "/logout.html");
    console.log("log out success");
});
//logout END
//upload Start
app.get('/upload', (req, res) => {
    res.sendFile(__dirname + "/uploadFile.html")

})
app.post('/upload', (req, res) => {
    var file = req.body.Tfile
    var FileExtenson = path.extname(file);
    console.log(FileExtenson)
    var DataArray = []
    var mainArray = []
    var Doc_coinname, Doc_orderType, Doc_price, Doc_totalCost, Doc_SellCost, Doc_units;


    fs.readFile(file, "utf-8", (err, filedata) => {
        if (err) console.log(err)
        DataArray = JSON.parse(filedata)

        for (var i = 0; i < DataArray.length; i++) {
            Doc_coinname = DataArray[i].Market
            Doc_orderType = DataArray[i].Type
            Doc_price = parseFloat(DataArray[i].Price).toFixed(5)
            Doc_units = parseFloat(DataArray[i].Amount).toFixed(5)
            if (Doc_orderType == "SELL") {
                Doc_SellCost = parseFloat(DataArray[i].Total).toFixed(5)
                Doc_totalCost = 0
                Doc_units = 0 - Doc_units;
            }
            else {
                Doc_SellCost = 0
                Doc_totalCost = parseFloat(DataArray[i].Total).toFixed(5)
                Doc_units = parseFloat(Doc_units).toFixed(5);
            }
            Doc_price
            var array1 = [];
            array1.push(`${Doc_coinname}`, `${Doc_orderType}`, Doc_price, Doc_units, Doc_totalCost, Doc_SellCost)
            mainArray.push(array1)
        }
    })
    var Sq = `INSERT INTO portfolio (Coin_Name,ORDER_TYPE,PRICE,UNITS,TOTAL_COST,SELL_COST ) VALUES ?`
    setTimeout(() => {
        console.log(mainArray)

        cnn.query(`use ${tablename}`, (err, result) => {
            if (err) console.log(err)
            console.log(result)
            conn.query(Sq, [mainArray], (err, result) => {
                if (err) console.warn(err)
                console.log(result)
            })
        })
        res.redirect('/dash-bord')
    }, 1000)


})
//upload end
//----End---

var emailid
var username
var name
app.post("/user", (req, res) => {
    var jdate = new Date()
    var JoinningDAte = jdate.toString()
    username = req.body.userName;
    name = req.body.Name;
    emailid = req.body.emailId;
    var password = req.body.password;

    if (!cnn._connectCalled) {
        cnn.connect(function (err) {
            if (err) throw err;
            console.log("connected");
            sqlqr = `insert into newUsers values('${username}','${name}' ,'${emailid}',${sts},'${password}','${JoinningDAte}')`
            cnn.query(sqlqr, (err, result) => {
                // console.log(result);
                if (err) throw err;
                console.log("after create table" + result)
                res.render(__dirname + "/Rresponse", { name })
            })
        });
    }
    else {
        sqlqr = `insert into newUsers values('${username}','${name}' ,'${emailid}',${sts},'${password}','${JoinningDAte}')`
        cnn.query(sqlqr, (err, result) => {
            // console.log(result);
            if (err) throw err;
            console.log("after create table" + result)
            res.render(__dirname + "/Rresponse", { name })
        })
    }
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
const validateCoinName = (req, res, next) => {
    if (!req.query.Asset) {
        res.redirect('/dash-bord')
    }
    else {
        next()
    }
}
//--Start---Route for get detail for all transaction of a perticulor coin

app.get('/Transactions', validateCoinName, (req, res) => {
    if (found) {
        console.log(req.query.Asset)
        var Asset_Name = req.query.Asset
        var coinSymbol = Asset_Name.substring(Asset_Name.length - 5, 1)
        var ImageSrc;
        var CurrenPrice;
        var ChangeIn7D;
        var ChangeIn30D;
        var ChangeIn60D;
        var ChangeIn90D;
        var SumInvested = 0
        var SumSellCost = 0
        var Avp;
        var CoinId
        var CmcName;
        var CmcSymbol;
        var PnlArray = [];
        var TotalPNLD;
        var TotalPNLP;
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



                    // console.log(FinalData.data)
                    CmcName = FinalData.data[`${coinSymbol}`][0].name
                    CmcSymbol = FinalData.data[`${coinSymbol}`][0].symbol
                    CurrenPrice = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].price
                    ChangeIn24H = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_24h
                    ChangeIn7D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_7d
                    ChangeIn30D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_30d
                    ChangeIn60D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_60d
                    ChangeIn90D = FinalData.data[`${coinSymbol}`][0]['quote']['USD'].percent_change_90d

                    setTimeout(() => {
                        CoinId = FinalData.data[`${coinSymbol}`][0].slug;
                        if (CoinId == 'polkadot-new') {
                            CoinId = CoinId.substring(CoinId.length - 4, 0)
                        }
                        else if (CoinId == "sxp") {
                            console.log("TRUE")
                            CoinId = "swipe";
                        }
                        else if (CoinId == "bnb") {
                            CoinId = "binancecoin"
                        }
                        else if (CoinId == "terra-luna-v2") {
                            CoinId = "terra-luna"
                        }
                        else if (CoinId == "near-protocol") {
                            CoinId = "near"
                        }
                        else if (CoinId == "polygon") {
                            CoinId = "matic-network"
                        }
                        setTimeout(() => {
                            Coingecko(CoinId)
                        }, 100)
                    }, 100)
                    // console.log("Coin Name :", CoinId)



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
                    ImageSrc = FinalData.image.large;
                    console.log(ImageSrc)
                    cnn.query(`select *from portfolio where COIN_NAME=${Asset_Name}`, (err, results) => {
                        if (err) console.log(err)
                        var holding = 0
                        console.log(results)
                        for (var u = 0; u < results.length; u++) {

                            holding = holding + parseFloat(results[u].UNITS);
                            SumInvested = SumInvested + parseFloat(results[u].TOTAL_COST - results[u].SELL_COST)
                            SumSellCost = SumSellCost + parseFloat(results[u].SELL_COST)
                            if (results[u].ORDER_TYPE == "BUY") {
                                var Detailspnl
                                Detailspnl = parseFloat(((CurrenPrice - results[u].PRICE) / results[u].PRICE) * 100)
                                PnlArray.push(Detailspnl);
                            }


                        }
                        Avp = (SumInvested - SumSellCost) / holding
                        console.log("holding=", SumInvested + "-" + SumSellCost + "/" + holding)
                        TotalPNLD = (((holding * CurrenPrice) + SumSellCost) - SumInvested)
                        TotalPNLP = parseFloat((((holding * CurrenPrice) + SumSellCost) - SumInvested) / SumInvested) * 100
                        Avp = parseFloat(Avp).toFixed(4)
                        res.render(__dirname + "/Details", {
                            results, holding, ImageSrc, CurrenPrice, ChangeIn24H, ChangeIn30D, ChangeIn7D, ChangeIn60D, ChangeIn90D, Avp, CmcName, CmcSymbol, Detailspnl, TotalPNLD, TotalPNLP, SumInvested
                        })


                    })

                });

        }


    }
    else {
        res.redirect('/login')
    }
})


//Dash-Bord START------------------->
var Current_Value
var b;
var invested = 0;
app.get("/dash-bord", auth, (req, res) => {
    function DbOperationsForDashbord() { //function for database operation for dashBord route  ----START-----
        Current_Value = 0
        invested = 0
        var coinname = [];
        var TotalCost = [];
        var SellCost = [];
        var TotalUnit = [];
        var Dpnl = [];
        var Ppnl = [];
        var dpnlvalue;
        var ppnlvalue;
        var price;
        var cv;

        var TotalSell;
        var chartContent = [];
        cnn.query(`use ${tablename}`, (err, result) => {
            if (err) console.log("Err At switching database for Funding Table ==> ", err)
            console.log(result)
            cnn.query('select *from funding', (err, fundingResult) => {
                if (err) console.log("Err At switching database for Funding Table ==> ", err)
                console.log(fundingResult)
                cnn.query('select SUM(amount) as balance from funding', (err, Fbalance) => {
                    if (err) console.log(err)
                    b = Fbalance[0].balance;

                    cnn.query(`select  Coin_Name, sum(UNITS) as TU ,sum(TOTAL_COST) as TC, sum(SELL_COST) as SC from portfolio group BY Coin_Name`, (err, results) => {
                        if (err) console.log(err);
                        var len = results.length;

                        var pnl = [];
                        //   var data = google.visualization.arrayToDataTable([
                        //     ['Task', 'Hours per Day'],
                        //     ['Work', 11],
                        //     ['Eat', 2],
                        //     ['Commute', 2],
                        //     ['Watch TV', 2],
                        //     ['Sleep', 7]
                        // ]);
                        for (var i = 0; i < len; i++) {
                            coinname.push(results[i].Coin_Name.toUpperCase());
                            TotalCost.push(results[i].TC);
                            invested = parseFloat(invested + (results[i].TC - results[i].SC));
                            invested = parseFloat(invested)
                            SellCost.push(results[i].SC);
                            TotalUnit.push(results[i].TU);
                            TotalSell = TotalSell + parseFloat(results[i].SC)
                            var CC = [];
                            CC.push(`${results[i].Coin_Name}` + ',' + results[i].TC)
                            chartContent.push(CC)
                        }
                        console.log("coins Name=", coinname)
                        console.log("Total Cost=", TotalCost)
                        console.log("Sell Cost=", SellCost)

                        var url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
                        currentprice = [];
                        price;
                        i = 0;
                        const loop = async () => {
                            for (var CoinName of coinname) {
                                await axios(url + CoinName)
                                    .then((response) => {
                                        return response.data;
                                    })
                                    .then((FinalData) => {
                                        // console.log(FinalData.symbol);
                                        price = FinalData.askPrice;
                                        console.log(price)
                                        // console.log("SYMBOL :", FinalData.symbol, "ASK Price ::", FinalData.askPrice)


                                        setTimeout(() => {
                                            if (TotalUnit[i] > 0) {
                                                console.log("If condition is true ");
                                                // Current_Value = parseFloat(Current_Value + TotalUnit[i] * price + SellCost[i]).toFixed(3);
                                                dpnlvalue = ((TotalUnit[i] * price) + SellCost[i]) - TotalCost[i]
                                                dpnlvalue = parseFloat(dpnlvalue)
                                                console.log("current value before push :", Current_Value)
                                                Current_Value += dpnlvalue
                                                console.log("current value AFTER push :", Current_Value)
                                                console.log("PNL IN $  = $", dpnlvalue)
                                                Dpnl.push(dpnlvalue)
                                                ppnlvalue = ((((TotalUnit[i] * price) + SellCost[i]) - TotalCost[i]) / TotalCost[i]) * 100;
                                                console.log("PNL IN %  = ", ppnlvalue + "%")
                                                ppnlvalue = parseFloat(ppnlvalue).toFixed(2)
                                                Ppnl.push(ppnlvalue)
                                            }
                                            else {
                                                console.log("else condition is true ");
                                                dpnlvalue = SellCost[i] - TotalCost[i];
                                                // Current_Value = parseFloat(Current_Value + SellCost[i]).toFixed(3);
                                                dpnlvalue = parseFloat(dpnlvalue)
                                                Current_Value += dpnlvalue
                                                console.log("PNL IN $  = $", dpnlvalue)
                                                Dpnl.push(dpnlvalue);
                                                ppnlvalue = ((SellCost[i] - TotalCost[i]) / TotalCost[i]) * 100;
                                                ppnlvalue = parseFloat(ppnlvalue).toFixed(2)
                                                console.log("PNL IN %  = ", ppnlvalue + "%")
                                                Ppnl.push(ppnlvalue);
                                            }
                                            i++;
                                        }, 100)
                                        console.log(Dpnl)
                                        console.log(Ppnl)
                                        console.log("Chart Content ====", chartContent)

                                        // console.log(i);
                                    });
                            }


                            setTimeout(() => {
                                res.render(__dirname + "/dashbord", {
                                    results,
                                    Coins: allAsset,
                                    invested,  //pvalue means portfolio value 
                                    Dpnl, Ppnl, Fbalance, fundingResult, Current_Value, chartContent, coinname, cv, TotalSell
                                });
                            }, 100)
                        }

                        // console.log("PNL :::::::::::::::::::::::::", PNL / coinname.length)

                        loop();
                        // console.log("gain ARRAY :", gain)
                        // pnl  close

                        var allAsset = [... new Set(coinname)];
                        // cnn.query(total, tablename, (err, sum) => {
                        invested = parseFloat(invested).toFixed(3)
                        // console.log(results);
                        // })

                    });
                })
            });
        })
    }//function for database operation for dashBord route  ----END-----
    if (found) { //found will be true if username &  passwords are match in record 
        if (req.session.loggedin) {
            if (!cnn._connectCalled) {
                console.log(" IF Function Called In DASH Bord -----------------")
                cnn.connect((err) => {
                    if (err) console.log(err);
                    DbOperationsForDashbord(req, res);
                })
            } else {
                //-----------
                console.log("Else Function Called In Dash-Bord ---------------------------------------")
                // var sql = `select *from ${tablename}`;
                DbOperationsForDashbord(req, res)
            }
        }
    } else {
        res.redirect("/login");
    }
});
//Dash-Bord END------------------->
app.post("/delete", (requsts, respons) => {
    var orderid = requsts.body.id;
    // console.log("request :", orderid)
    // console.log("post hit")
    // var del=`delete from ${tablename} where id=${orderid}`
    conn.query(`delete from ${tablename} where id=${orderid}`, (e, r) => {
        if (e) {
            console.log(e)
        }
        respons.sendFile(__dirname + "/delete.html")
    })

});
app.listen(7000);
