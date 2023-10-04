var express = require('express');
var router = express.Router();
const axios = require("axios");
const profile = require('../../middlewares/profile');
const {decryptRequest, encryptResponse} = require("../../middlewares/crypt")
const checkCookie = require("../../middlewares/checkCookie");
const IpCheck = require('../../middlewares/IpCheck');
var userdb = require('../../middlewares/userdb');

/* !!! GOLD는 가짜버튼 !!! */

HTML_MEMBER = `
    <thead>
        <tr>
            <th>회원 등급</th>
            <th>FRIEND</th>
            <th>GOLD</th>
            <th>PREMIUM</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><b>누적 이용 기간</b></td>
            <td>최초 가입</td>
            <td>1달 이상</td>
            <td>1년 이상</td>
        </tr>
        <tr>
            <td><b>거래 한도</b></td>
            <td>하루 최대 $ 10,000</td>
            <td>하루 최대 $ 50,000</td>
            <td>하루 최대 $ 10,000,000</td>
        </tr>
        <tr>
            <td><b>비고</b></td>
            <td colspan="3">등급에 관한 자세한 문의는 관리자에게 해 주세요.</td>
        </tr>
    </tbody>`

router.get('/', checkCookie, function (req, res) {
    const cookie = req.cookies.Token

    profile(cookie).then(pending => {
        axios({
            method: "post",
            url: api_url + "/api/beneficiary/ceiling",
            headers: {"authorization": "1 " + cookie}
        }).then((data) => {
            let html = ""
            const resStatus = decryptRequest(data.data).status;
            const resData = decryptRequest(data.data).data;

            if(Array.isArray(resData))
            {
                html +=
                    "<h2 align='center'>환영합니다, 관리자님!</h2>\n" +
                    "<thead>\n" +
                    "   <tr>\n" +
                    "      <th>사용자명</th>\n" +
                    "      <th>현재 멤버십</th>\n" +
                    "      <th colspan='2'>권한 상승</th>\n" +
                    "   </tr>\n" +
                    "</thead>\n"
                
                const printData = resData.slice(1,)
                printData.forEach(x => {
                    html += 
                    `<tbody>
                        <tr>
                            <td>${x.username}</td>
                            <td>${x.membership}</td>
                            <td><a class="btn btn-secondary btn-user btn-block">GOLD로 승급</td>
                            <td><a href="/bank/membership/change?id=${x.id}" class="btn btn-info btn-user btn-block">PREMIUM으로 승급</td>
                        </tr>
                    </tbody>`
                })
            } else if (resStatus.code === 200) {
                if(resData.membership === "ADMIN") {
                    html += "<h2>아니??? 이 사이트에는 멤버십을 관리할 유저가 없습니다!!!</h2>"
                }
                else {
                    html += `<h2 align='center'>회원님의 멤버십 등급은 ${resData.membership}등급입니다.</h2>`
                    html += HTML_MEMBER
                }
            } else {
                html += "<h2>오류시군요!!!</h2>"
            }
            res.render("Banking/membership", {html: html, pending: pending, select: "membership"})
        })
    })
});

router.get('/change', [checkCookie, IpCheck], function (req, res, next) {
    const id = req.query.id;
    userdb.query(`UPDATE users
                  SET membership = 'PREMIUM'
                  WHERE id =${id};`, function (error, results) {
        if (error) { throw error; }
    });

    return res.redirect("/bank/membership")
});

module.exports = router;