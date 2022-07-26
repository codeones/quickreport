const jwt = require('jsonwebtoken')
const createTocken = async () => {
    const tocken = await jwt.sign({ username: "panakjpareek" }, "ecerydayisdeffrentdayamakeyourdayhappy")
    console.log(tocken)
    const userVarification = await jwt.verify(tocken, "ecerydayisdeffrentdayamakeyourdayhappy")
    console.log(userVarification)
}
createTocken()