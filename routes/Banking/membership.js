var express = require('express');
var router = express.Router();
var axios = require("axios");
var {decryptRequest} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');
const checkCookie = require("../../middlewares/checkCookie");

router.get('/', checkCookie, function (req, res) {
    const cookie = req.cookies.Token;

    profile(cookie).then(pending => {

        axios({
            method: "post",
            url: api_url + "/api/user/profile",
            headers: {"authorization": "1 " + cookie}
        }).then((data) => {
            let result = decryptRequest(data.data).data;
            var html_data = ``;
            
            if(result.membership == "FRIEND") {
                html_data = `<h2 align='center'>회원님의 멤버십 등급은 FRIEND등급입니다.</h2>
                <p align='center'>멤버십 등급이 높아지면 지금보다 더 많은 특별한 혜택을 경험할 수 있습니다.</p>`
            } else if (result.membership == "ADMIN") {
                html_data = `<h2 align='center'>당신은 관리자입니다.</h2>
                <p align='center'>환영합니다, 관리자님!</p>`       
            } else {
                html_data = `<h2 align='center'>회원님의 멤버십 등급은 ${result.membership}등급입니다.</h2>
                <p align='center'>축하합니다! 이제 ${result.membership}등급의 모든 혜택을 경험할 수 있습니다.</p>`
            }

            html_data += `<thead>
            <tr>
                <th>회원등급</th>
                <th>FRIEND</th>
                <th>GOLD</th>
                <th>PREMIUM</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><b>누적 이용 횟수</b></td>
                <td>최초 가입</td>
                <td>100회 이상</td>
                <td>100,000회 이상</td>
            </tr>
            <tr>
                <td><b>회원 혜택</b></td>
                <td>포인트 적립 가능</td>
                <td>포인트 적립 시 3% 추가 적립<br>이체 수수료 3% 할인</td>
                <td>포인트 적립 시 10% 추가 적립<br>이체 수수료 10% 할인</td>
            </tr>
            <tr>
                <td><b>비고</b></td>
                <td colspan="3">멤버십 페이지를 모의해킹에 쓸 수 있을지 궁금합니다.</td>
            </tr>
            </tbody>
            `
            return res.render("Banking/membership", {html: html_data, pending: pending, select: "membership"});
        }).catch(function (error) {
            var html_data = "<tr>에러</tr>";
            return res.render("Banking/membership", {html: html_data, pending: pending, select: "membership"});
        });
    })
})

module.exports = router;