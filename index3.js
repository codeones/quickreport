const express = require("express");
const axios = require("axios");
const console = require('console');
const cnn = require("./connection");
var nodemailer = require('nodemailer');
const bodyparser = require("body-parser");
const app = express();
app.use(express.json())
const session = require("express-session");
const { request, response } = require("express");
const { dirname } = require("path");
const conn = require("./connection");
const { stringify } = require("querystring");
const { SlowBuffer } = require("buffer");
app.use(bodyparser.json());
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

var userEmail;
var tablename;
var found;
//register start
app.get('/register', (req, res) => {
  if (req.session.loggedin) {
    res.render(__dirname + "/already", { as: tablename, })


  }
  else {

    var tables;
    if (!cnn._connectCalled) {
      cnn.connect(function (err) {
        if (err) throw err;
        console.log("connected");
        var sql = "SHOW TABLES"
        cnn.query(sql, (err, result) => {
          if (err) throw err;

          tables = result;
          console.log("Tables :::", tables)
        })

      })
    }
    else {

      var sql = "SHOW TABLES"
      cnn.query(sql, (err, result) => {
        if (err) console.log("ERRRR :: ", err)
        tables = result;
        console.log("Tables :::", tables)
      })
    }
    res.render(__dirname + "/signup", { alltables: tables })
  }
})
//register END

//login Start
function LoginPostIf(req, res) {
  console.log("-----------If Function Call----------")

  cnn.connect(function (err) {
    if (err) throw err;
    console.log("connected");
    var sqllogin = `select *from newUsers WHERE username='${usernameorEmail}' AND password='${passwordlog}'`;
    // console.log(sqllogin);
    cnn.query('use testdb', (err, result) => {
      cnn.query(sqllogin, (err, resultl) => {
        if (err) throw err;

        // console.log("Email ID : ", userEmail)
        if (resultl.length > 0) {
          tablename = usernameorEmail;
          found = true;
          status = resultl[0].varified;
          userEmail = resultl[0].emailid;
          // console.log(userEmail)
          req.session.loggedin = true;
          res.render(__dirname + "/loginsuccess", { name: tablename, Ustatus: status });
        } else {
          res.sendFile(__dirname + "/notregistered.html");
        }
      })
    })
  });
}
function LoginPostElse(req, res) {
  console.log("-----------Else Function Call----------")

  // var sqllogin = `select *from newUser WHERE username='${usernameorEmail}' AND password=${passwordlog}`
  var sqllogin = `select *from newUsers WHERE username='${usernameorEmail}' AND password='${passwordlog}'`;

  cnn.query('use testdb', (err, result) => {
    cnn.query(sqllogin, (err, resultl) => {
      if (err) throw err;

      // console.log("Email ID : ", userEmail)
      if (resultl.length > 0) {
        tablename = usernameorEmail;
        found = true;
        status = resultl[0].varified;
        userEmail = resultl[0].emailid;
        // console.log(userEmail)
        req.session.loggedin = true;
        res.render(__dirname + "/loginsuccess", { name: tablename, Ustatus: status });
      } else {
        res.sendFile(__dirname + "/notregistered.html");
      }
    })
  })
}
var i = 0, otp, status;
// Login Rout
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
var usernameorEmail;
app.post("/login", (req, res) => {
  // console.log("BODY::::", req.body)
  usernameorEmail = req.body.usrName;
  passwordlog = req.body.Passlog;

  if (!cnn._connectCalled) {
    LoginPostIf(req, res); //connection function call for first time handshake
  } else {
    LoginPostElse(req, res); //call if handshake already done
  }
});


//Login End

//portfollio Start
app.get("/portfolio", (req, res) => {
  if (!req.session.loggedin) {
    res.sendFile(__dirname + "/loginfirst.html");
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
  } else {
    unit = unit;
  }

  if (!cnn._connectCalled) {
    cnn.connect(function (err) {
      if (err) throw err;
      console.log("connected");
      var sql = `INSERT INTO portfolio VALUES(null,'${coinname}','${base}','${ordertype}',${price},${unit},${total})`;
      cnn.query(sql, (err, result) => {
        if (err) throw err;
        res.sendFile(__dirname + "/response.html");

      });

    });
  } else {
    var sql = `INSERT INTO portfolio VALUES(null,'${coinname}','${base}','${ordertype}',${price},${unit},${total})`;
    cnn.query(sql, (err, results) => {
      if (err) throw err;
      res.sendFile(__dirname + "/response.html");

    });
  }
});
//Funding route start
app.get('/funding', (req, res) => {
  res.sendFile(__dirname + "/MainFunding.html")
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
      res.send("Submited")
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
      response.send(" Email Varification SuccessFull !")
      response.redirect('/dash-bord')
    })
  }
  else {
    response.send("Invalid OTP")
  }
})
app.get('/v', (req, res) => {
  if (found) {
    conn.query(`update newUsers SET varified=true where username='${tablename}'`, (e, result) => {
      if (e) {
        res.sendFile(__dirname + "Err404.html")
      };
      // console.log('SET 1 RESULT :: ', result)
      if (result.affectedRows == 1) {
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
    html: `<h1>Welcome To Quick Report </h1><br> <h2> Your Email Varification Code</h2> <b style="color:#F0B90B;background-color:black;font-size:50px">${otp}</b>`

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

  res.sendFile(__dirname + "/logout.html");
  console.log("log out success");
});
//logout END
var emailid
app.post("/user", (req, res) => {
  var username = req.body.userName;
  var name = req.body.Name;
  emailid = req.body.emailId;
  var password = req.body.password;

  if (!cnn._connectCalled) {
    cnn.connect(function (err) {
      if (err) throw err;
      console.log("connected");

      var tbl = `CREATE TABLE portfolio(id int NOT NULL AUTO_INCREMENT KEY,Coin_Name VARCHAR(10),BASE VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50));`;
      var tbl2 = 'create table funding(amount varchar(50),type varchar(50),discription varchar (500), date varchar(50)) '
      //create table newUser(username varchar(50) primary key,name varchar(50),emailid varchar(50) uniq,varified bool,password varchar(50));      var tbl = `CREATE TABLE ${username}(id int NOT NULL AUTO_INCREMENT KEY, Coin_Name varchar(10),BASE VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50))`;

      //  =
      //   "INSERT INTO newUsers VALUES('" +username +"','" +name +"','"+emailid +"','sts ','" +password +"');";
      sqlqr = `insert into newUsers values('${username}','${name}' ,'${emailid}',${sts},'${password}')`
      cnn.query(sqlqr, (err, result) => {
        // console.log(result);
        if (err) throw err;
        if (err) throw err;
        console.log("after create table" + result)
        cnn.query(`create database ${username}`, (err, result) => {
          if (err) console.log(err)
          cnn.query(`use  ${username}`, (err, result) => {
            cnn.query(tbl, (err, result) => {
              if (err) console.log(err)
              res.render(__dirname + "/Rresponse", { name: name })
            })
          })
        })
      })
    });


  } else {
    var tbl = `CREATE TABLE portfolio(id int NOT NULL AUTO_INCREMENT KEY,Coin_Name VARCHAR(10),BASE VARCHAR(10),ORDER_TYPE VARCHAR(10), PRICE VARCHAR(50),UNITS VARCHAR(50),TOTAL_COST VARCHAR(50));`;
    sqlqr = `insert into newUsers values('${username}','${name}' ,'${emailid}',${sts},'${password}')`
    var tbl2 = 'create table funding(amount varchar(50),type varchar(50),discription varchar (50), date varchar(50)) '

    //db operations start

    cnn.query(sqlqr, (err, result) => {
      if (err) throw err;
      console.log("after create table" + result)
      cnn.query(`create database ${username}`, (err, result) => {
        if (err) console.log(err)
        cnn.query(`use  ${username}`, (err, result) => {
          cnn.query(tbl, (err, result) => {
            if (err) console.log(err)
            cnn.query(tbl2, (err, result) => {
              if (err) console.log(err)
              res.render(__dirname + "/Rresponse", { name: name })
            })

          })
        })
      })
    }) //db operations end
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Dash-Bord START------------------->

app.get("/dash-bord", (req, res) => {
  var PNL = 0;
  var currentprice = [];
  var price;
  var Pchange
  var orderprice = [];
  var DollorValueArray = []
  var DollorValue;
  var TotalCostArray = [];
  var DollorPNL = 0;
  var tds = 0;
  var gain = [];

  if (found) {
    if (req.session.loggedin) {
      if (!cnn._connectCalled) {
        console.log(" IF Function Called In DASH Bord -----------------")

        cnn.connect((err) => {
          if (err) console.log(err);
          // var sql =` select *from  ?? `;
          cnn.query(`use ${tablename}`, (err, result) => {
            if (err) console.log("Err At switching database for Funding Table ==> ", err)
            console.log(result)
            cnn.query('select *from funding', (err, fundingResult) => {
              if (err) console.log("Err At switching database for Funding Table ==> ", err)
              console.log(fundingResult)
              cnn.query('select SUM(amount) as balance from funding', (err, Fbalance) => {

                if (err) console.log(err)
                console.log("Funding balance:== ", Fbalance[0].SUM(amount))
                // for (var f = 0; f < fundingResult.length; f++) {
                //   Fbalance = Fbalance + fundingResult[f].amount;
                // }
                // console.log(Fbalance)
                cnn.query(` select *from portfolio`, (err, results) => {
                  if (err) console.log(err);
                  var len = results.length;
                  coinname = [];
                  orderprice = [];
                  currancy = [];
                  var invested = 0;
                  var pnl = [];
                  for (var i = 0; i < len; i++) {
                    coinname.push(("'" + results[i].Coin_Name + results[i].BASE + "'").toUpperCase());
                    currancy.push((results[i].BASE).toUpperCase());
                    orderprice.push(results[i].PRICE);
                    invested = Number(invested) + Number(results[i].TOTAL_COST);
                    invested = Number(invested);
                    TotalCostArray.push(results[i].TOTAL_COST)
                    if (invested >= 100000 && invested < 10000000) {
                      invested + "lack"
                    }
                    else if (invested >= 10000000) {

                      invested + "CR"
                    }
                    if (results[i].ORDER_TYPE == "BUY") {
                      tds = tds + results[i].TOTAL_COST / 100;
                    }
                  }
                  // console.log("TOTAL Cost ARRAY ", TotalCostArray)
                  // PNL start
                  var url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
                  currentprice = [];
                  price;

                  i = 0;
                  const loop = async () => {
                    for (var CoinName of coinname) {
                      if (request.ORDER_TYPE == "BUY") {
                        const apidata = await axios(url + CoinName)
                          .then((response) => {
                            return response.data;

                          })
                          .then((FinalData) => {
                            // console.log(FinalData.symbol);
                            price = FinalData.askPrice;
                            // console.log("SYMBOL :", FinalData.symbol, "ASK Price ::", FinalData.askPrice)
                            const saveprice = async () => { //SAVE Price Function 
                              await currentprice.push(price);
                              Pchange = await parseFloat(((currentprice[i] - orderprice[i]) / orderprice[i]) * 100).toFixed(2);
                              await gain.push(Pchange);
                              DollorValue = parseFloat((Pchange * TotalCostArray[i]) / 100).toFixed(2);
                              DollorPNL = parseFloat(DollorPNL + DollorValue);
                              DollorValueArray.push(DollorValue);
                              PNL = parseInt(PNL) + parseInt(Pchange);
                              i++;
                            };
                            saveprice();
                            // console.log(i);
                          });
                      }
                    }
                    PNL = PNL / coinname.length;
                    // console.log("PNL :::::::::::::::::::::::::", PNL / coinname.length)
                    setTimeout(() => {
                      res.render(__dirname + "/dashbord", {
                        results,
                        Coins: allAsset,
                        pvalue: invested,  //pvalue means portfolio value 

                        TDS: tds, gain, PNL, DollorValueArray, DollorPNL, fundingResult, Fbalance
                      });
                    }, 2000)
                  };
                  loop();


                  // console.log("gain ARRAY :", gain)
                  // pnl  close
                  var total = `SELECT SUM(TOTAL_COST)  FROM ?`;
                  var allAsset = [... new Set(coinname)];
                  cnn.query(total, tablename, (err, sum) => {
                    invested = parseFloat(invested).toFixed(3)

                    // console.log(results);
                  })

                });
              })
            });
          })
        })
      } else {
        //-----------

        console.log("Else Function Called In Dash-Bord ---------------------------------------")

        // var sql = `select *from ${tablename}`;




        cnn.query(`use ${tablename}`, (errs, result) => {
          cnn.connect((errs) => {
            if (errs) console.log(errs);
            cnn.query('select *from funding', (err, fundingResult) => {
              if (err) console.log(err);
              // console.log(fundingResult)
              cnn.query('select SUM(amount)as balance from funding', (err, Fbalance) => {

                if (err) console.log(err)
                console.log("Funding balance:== ", Fbalance)
                // var sql =` select *from  ?? `;
                cnn.query(` select *from portfolio`, (err, results) => {
                  if (err) console.log(err);
                  var len = results.length;
                  coinname = [];
                  orderprice = [];
                  currancy = [];
                  var invested = 0;
                  var pnl = [];
                  for (var i = 0; i < len; i++) {
                    coinname.push((results[i].Coin_Name + results[i].BASE).toUpperCase());
                    currancy.push((results[i].BASE).toUpperCase());
                    orderprice.push(results[i].PRICE);
                    invested = Number(invested) + Number(results[i].TOTAL_COST);
                    invested = Number(invested);
                    TotalCostArray.push(results[i].TOTAL_COST)
                    if (invested >= 100000 && invested < 10000000) {
                      invested + "lack"
                    }
                    else if (invested >= 10000000) {

                      invested + "CR"
                    }
                    if (results[i].ORDER_TYPE == "BUY") {
                      tds = tds + results[i].TOTAL_COST / 100;
                      tds = parseFloat(tds).toFixed(2);
                    }
                  }
                  // console.log("TOTAL Cost ARRAY ", TotalCostArray)
                  // PNL start
                  var url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
                  currentprice = [];
                  price;

                  i = 0;
                  const loop = async () => {
                    for (var CoinName of coinname) {
                      const apidata = await axios(url + CoinName)
                        .then((response) => {
                          return response.data;

                        })
                        .then((FinalData) => {
                          // console.log(FinalData.symbol);
                          price = FinalData.askPrice;
                          // console.log("SYMBOL :", FinalData.symbol, "ASK Price ::", FinalData.askPrice)
                          const saveprice = async () => { //SAVE Price Function 
                            await currentprice.push(price);
                            Pchange = await parseFloat(((currentprice[i] - orderprice[i]) / orderprice[i]) * 100).toFixed(2);
                            await gain.push(Pchange);
                            DollorValue = parseFloat((Pchange * TotalCostArray[i]) / 100).toFixed(2);
                            DollorPNL = parseFloat(DollorPNL + DollorValue);
                            DollorValueArray.push(DollorValue);
                            PNL = parseInt(PNL) + parseInt(Pchange);
                            i++;
                          };
                          saveprice();
                          // console.log(i);
                        });
                    }
                    PNL = PNL / coinname.length;
                    // console.log("PNL :::::::::::::::::::::::::", PNL / coinname.length)
                    setTimeout(() => {
                      res.render(__dirname + "/dashbord", {
                        results,
                        Coins: allAsset,
                        pvalue: invested,  //pvalue means portfolio value 

                        TDS: tds, gain, PNL, DollorValueArray, DollorPNL, fundingResult, Fbalance
                      });
                    }, 2000)
                  };
                  loop();
                  console.log(D)


                  // console.log("gain ARRAY :", gain)
                  // pnl  close
                  var total = `SELECT SUM(TOTAL_COST)  FROM ?`;
                  var allAsset = [... new Set(coinname)];
                  cnn.query(total, tablename, (err, sum) => {
                    invested = parseFloat(invested).toFixed(3)

                    // console.log(results);
                  })

                });
              });
            })
          })
        })
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
