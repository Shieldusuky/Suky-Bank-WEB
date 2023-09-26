var express = require('express');
const mysql = require('mysql');
const dbConfig = require('./dbconn'); // MySQL 연결 설정 파일
var router = express.Router();

const {encryptResponse, decryptRequest} = require('../../middlewares/crypt')
const axios = require("axios");
const sha256 = require("js-sha256")

//인증번호 랜덤 생성 함수
function generateRandomVerificationCode() {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
            const coolsms = require('coolsms-node-sdk').default;
            // apiKey, apiSecret 설정
            const messageService = new coolsms('apikey', 'api secret');

            const auth_num = generateRandomVerificationCode();
            const auth_num_str = auth_num.toString();

            //if로 이미 authnum있으면~
            dbConfig.query(`SELECT * FROM smsauth WHERE username = '${username}'`, function(error, results, fields) {
                if (error) {
                    throw error;
                }
                else if(results.length > 0) {
                    dbConfig.query(`UPDATE smsauth SET authnum = '${auth_num_str}' WHERE username = '${username}'`, function(error, result) {
                        if (error) {
                            throw error;
                        }
                    });
                }else {
                    dbConfig.query(`INSERT INTO smsauth (username, authnum) VALUES ('${username}', '${auth_num_str}')`, function(error, result) {
                        if (error) {
                            throw error;
                        }
                    });
                }
            });


            // 2건 이상의 메시지를 발송할 때는 sendMany, 단일 건 메시지 발송은 sendOne을 이용해야 합니다. 
            messageService.sendOne(
                {
                to: "01025128819",
                from: "01025128819",
                text: auth_num_str
                }
                // 1만건까지 추가 가능
            ).then(res => console.log(res))
            .catch(err => console.error(err));
            return res.render("temp/login",{select: "login"});
        } else {
            return res.render("temp/signup");
        }
    })
});

module.exports = router;