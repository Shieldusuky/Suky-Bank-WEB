var express = require('express');
var router = express.Router();

const {encryptResponse, decryptRequest} = require('../../middlewares/crypt')
const axios = require("axios");
const sha256 = require("js-sha256")


/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.render("temp/findPass");
    res.render("temp/findPass", {select: "login"});
});


router.post('/', function (req, res, next) {
    const {username, phone} = req.body;
    const baseData = `{"username": "${username}", "phone": "${phone}"}`;
    const enData = encryptResponse(baseData);

    axios({
        method: "post",
        url: api_url + "/api/user/login",
        data: enData
    }).then((data) => {
        let result = decryptRequest(data.data);
        if (result.status.code == 200) {
            return res.render("afterlogin", {data: data.data.enc_data});
        } else {
            return res.render("afterlogin");
        }
    })
});

module.exports = router;