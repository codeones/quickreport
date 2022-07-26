var jwt = require('jsonwebtoken');

const createTocken = async () => {
    const tocken = await jwt.sign({ username: "pankajpareek" }, "quickreportiscreatedtotrackcryptomarketclosly")
    console.log(tocken);
}
createTocken()
