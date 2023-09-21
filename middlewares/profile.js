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
    const target = new Date("2023-2-14")
    const start = new Date("2022-12-13")
    const cur = new Date();
    const dotime = cur - start;
    const totaltime = target - start;

    const percent = (dotime / totaltime * 100)

    data2.data.rest = percent.toFixed(3)

    return data2
}

module.exports = profile