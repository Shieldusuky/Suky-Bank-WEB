var express = require('express');
var router = express.Router();
var axios = require("axios");
var {encryptResponse, decryptRequest} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');
const checkCookie = require("../../middlewares/checkCookie")

router.get('/', checkCookie, function (req, res, next) {
    const cookie = req.cookies.Token;

    profile(cookie).then(pending => {

        axios({
            method: "post",
            url: api_url + "/api/beneficiary/view",
            headers: {"authorization": "1 " + cookie}
        }).then((data) => {
            let result = decryptRequest(data.data).data;
            var html_data = `<thead>
                            <tr>
                                <th>멤버십</th>
                            </tr>
                            </thead>
                            
                            <tbody>
                            `;

            result.forEach(function (a) {
                html_data += `<tr>
                <td>${a.id}</td>
                            </tr>`;
            })

            html_data += `</tbody>`;

            return res.render("Banking/membership", {html: html_data, pending: pending, select: "membership"});
        }).catch(function (error) {
            var html_data = "<tr>오류났어</tr>";

            return res.render("Banking/membership", {html: html_data, pending: pending, select: "membership"});
        });
    })
})

module.exports = router;
