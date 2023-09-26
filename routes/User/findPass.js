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


router.post('/', async function (req, res, next) {
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
            // const coolsms = require('coolsms-node-sdk').default;
            // // apiKey, apiSecret 설정
            // const messageService = new coolsms('NCSXDF6SVD0EQ9MX', 'ZT7GHUS1DXIX4R9IT7GIEN2VCTVB0Q9A');

            // // 2건 이상의 메시지를 발송할 때는 sendMany, 단일 건 메시지 발송은 sendOne을 이용해야 합니다. 
            // messageService.sendOne(
            //     {
            //     to: "01025128819",
            //     from: "01025128819",
            //     text: "test"
            //     }
            //     // 1만건까지 추가 가능
            // ).then(res => console.log(res))
            // .catch(err => console.error(err));
            return res.render("temp/smsAuth", {select: "login"});
        } else {
            return res.render("temp/findPass");
        }
    })
});

module.exports = router;