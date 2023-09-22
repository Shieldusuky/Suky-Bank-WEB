var express = require('express');
const axios = require("axios");
const {decryptRequest, decryptEnc, encryptResponse} = require("../../middlewares/crypt");
const Response = require("../../middlewares/Response");
const sha256 = require("js-sha256")
var router = express.Router();
const checkCookie = require("../../middlewares/checkCookie")

router.get('/', function (req, res, next) {
    // res.render("temp/findPass");
    res.render("temp/findPassnext", {select: "login"});
});


router.post("/", checkCookie, (req, res) => {
    const {password, new_password} = req.body
    const sha256Pass = sha256(password)
    const sha256Newpass = sha256(new_password)
    const req_data = `{"password" : "${sha256Pass}","new_password" : "${sha256Newpass}"}`
    const cookie = req.cookies.Token;
    let resStatus = ""
    let resMessage = ""

    axios({
        method: "post",
        url: api_url + "/api/User/change-password",
        headers: {"authorization": "1 " + cookie},
        data: encryptResponse(req_data)
    }).then((data) => {
        resStatus = decryptRequest(data.data).status
        resMessage = decryptRequest(data.data).data.message
        if (resStatus.code === 200) {
            return res.send("<script>alert('비밀번호가 변경되었습니다.');location.href = \"/user/login\";</script>");
        } else {
            res.render("temp/changePass", {select: "login", message: resMessage})
        }
    });
})

module.exports = router;