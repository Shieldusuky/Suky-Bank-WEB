var express = require('express');
var router = express.Router();
var axios = require("axios");
var {decryptRequest} = require("../../middlewares/crypt");
const profile = require('../../middlewares/profile');
const checkCookie = require("../../middlewares/checkCookie")

router.get('/', checkCookie, function (req, res) {
    const cookie = req.cookies.Token;

    profile(cookie).then(pending => {

        axios({
            method: "post",
            url: api_url + "/api/user/profile",
            headers: {"authorization": "1 " + cookie}
        }).then((data) => {
            let result = decryptRequest(data.data).data;
            var html_data = `<thead>
                            <tr>
                                <th>멤버십 번호</th>
                            </tr>
                            </thead>
                            
                            <tbody>
                            <tr>
                                <td>${result.membership}</td>
                            </tr>
                            </tbody>`

            return res.render("Banking/membership", {html: html_data, pending: pending, select: "membership"});
        }).catch(function (error) {
            var html_data = "<tr>에러</tr>";
            return res.render("Banking/membership", {html: html_data, pending: pending, select: "membership"});
        });
    })
})

module.exports = router;