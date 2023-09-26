var express = require('express');
const axios = require("axios");
const {decryptRequest, decryptEnc, encryptResponse} = require("../../middlewares/crypt");
const Response = require("../../middlewares/Response");
const sha256 = require("js-sha256")

var router = express.Router();

router.get('/', function (req, res, next) {
    // res.render("temp/findPassnext");
    var username = req.query.username;
    res.render("temp/findPassnext", {select: "login", username: username});
});


router.post("/", (req, res) => {
    const username = req.body.username;
    const new_password = req.body.next_new_password;
    const check_password = req.body.check_password;
    const sha256Pass = sha256(new_password)
    const sha256Newpass = sha256(check_password)
    const req_data = `{"username" : "${username}", "next_new_password" : "${sha256Pass}","check_password" : "${sha256Newpass}"}`
    let resStatus = ""
    let resMessage = ""

    axios({
        method: "post",
        url: api_url + "/api/User/findPassnext",
        data: encryptResponse(req_data)
    }).then((data) => {
        resStatus = decryptRequest(data.data).status
        resMessage = decryptRequest(data.data).data.message

        if (resStatus.code === 200) {
            return res.send("<script>alert('비밀번호가 변경되었습니다.');location.href = \"/user/login\";</script>");
        } else {
            res.render("temp/findPassnext", {select: "login", message: resMessage, username: username})
        }
    });
})

module.exports = router;