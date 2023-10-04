var express = require('express');
var router = express.Router();
const Response = require("../../middlewares/Response");
const {decryptRequest, decryptEnc, encryptResponse} = require("../../middlewares/crypt");
const axios = require("axios");
const sha256 = require("js-sha256")


/* GET users listing. */
router.get('/', function (req, res, next) {
    var username = req.query.username;
    res.render("temp/smsAuth", {select: "smsAuth", username: username});
});

router.post('/', (req, res) => {
    const username = req.body.username;
    const authnum = req.body.authnum;
    const baseData = `{"username": "${username}", "authnum" : "${authnum}"}`;
    let resStatus = ""
    let resMessage = ""

    axios({
        method: "post",
        url: api_url + "/api/User/smsAuth",
        data: encryptResponse(baseData)
    }).then((data) => {
        resStatus = decryptRequest(data.data).status
        resMessage = decryptRequest(data.data).data.message

        if (resStatus.code == 200) {
            //return res.send("<script>alert('인증이 완료되었습니다.');location.href = \"/user/findPassnext\";</script>");
            return res.send(`<script>alert('인증이 완료되었습니다.');location.href = \"/user/findPassnext?username=${username}\";</script>`);
        } else {
            res.render("temp/findPass", {select: "login", message: resMessage})
            // return res.send("<script>alert('인증에 실패하였습니다.');location.href = \"/user/findPass\";</script>");
        }
    })
});

module.exports = router;