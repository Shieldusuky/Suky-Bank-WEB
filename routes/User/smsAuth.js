var express = require('express');
var router = express.Router();

const {encryptResponse, decryptRequest} = require('../../middlewares/crypt')
const axios = require("axios");
const sha256 = require("js-sha256")


/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.render("temp/findPass");
    res.render("temp/smsAuth", {select: "smsAuth"});
});

router.post('/', async function (req, res, next) {
    const {username, smsauth} = req.body;
    const baseData = `{"username": "${username}", "authnum" : "${smsauth}"}`;
    const enData = encryptResponse(baseData);

    axios({
        method: "post",
        url: api_url + "/api/user/smsAuth",
        data: enData
    }).then((data) => {
        let result = decryptRequest(data.data);

        if (result.status.code == 200) {
            return res.send("<script>alert('인증이 완료되었습니다.');location.href = \"/user/findPassnext\";</script>");
        } else {
            return res.send("<script>alert('인증에 실패하였습니다.');location.href = \"/user/findPass\";</script>");
        }
    })
});

module.exports = router;