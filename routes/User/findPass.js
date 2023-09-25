var express = require('express');
var router = express.Router();

const {encryptResponse, decryptRequest} = require('../../middlewares/crypt')
const axios = require("axios");
const sha256 = require("js-sha256")


/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.render("temp/findPass");
    res.render("temp/findPass", {select: "findPass"});
});


router.post('/', function (req, res, next) {
    const {username, phone} = req.body;
    const baseData = `{"username": "${username}", "phone": "${phone}"}`;
    const enData = encryptResponse(baseData);

    axios({
        method: "post",
        url: api_url + "/api/user/findPass",
        data: enData
    }).then((data) => {
        let result = decryptRequest(data.data);

        if (result.status.code == 200) {
            var html_data = `<div class="text-center"><button style="width: 40%;" type="submit" formmethod="post" formaction="/user/login">인증 요청</button> &emsp;&emsp;&emsp;<a style="width: 40%;" onclick="location.href='/user/findPassnext'" class="mybtn">변경</a></div>`;
            return res.render("temp/findPass", {html: "html_data"});
        } else {
            return res.render("temp/findPass");
        }
    })
});

module.exports = router;