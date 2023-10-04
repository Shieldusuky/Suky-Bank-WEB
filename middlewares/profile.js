const axios = require("axios");
const {decryptRequest} = require("./crypt");
const profile = async (cookie) => {
    let data2
    await axios({
        method: "post",
        url: api_url + "/api/user/profile",
        headers: {"authorization": "1 " + cookie}
    }).then((data) => {
        data2 = decryptRequest(data.data)
    })

    const left = data2.data.membership
    if(left === "FRIEND") {
        data2.data.rest = "$ 10000"
    } else if (left === "PREMIUM") {
        data2.data.rest = "$ 1000000"
    } else if (left === "ADMIN") {
        data2.data.rest = "ADMIN"
    } else {
        data2.data.rest = ""
    }

    /*
    const target = new Date("2023-11-9")
    const start = new Date("2023-9-15")
    const cur = new Date();
    const dotime = cur - start;
    const totaltime = target - start;

    const percent = (dotime / totaltime * 100)
    */

    return data2
}

module.exports = profile