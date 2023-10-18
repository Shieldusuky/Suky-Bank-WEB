var db = require("../../middlewares/db");
var {seoultime} = require("../../middlewares/seoultime");
var express = require("express");
var router = express.Router();
var tokenauth = require("./tokenauth");
var {decryptEnc,} = require("../../middlewares/crypt");
const profile = require("../../middlewares/profile");
const checkCookie = require("../../middlewares/checkCookie");
const httpProxy = require('http-proxy');
const multer = require('multer')

router.get("/", function (req, res, next) {
    if (req.cookies.Token) {
        var cookie = decryptEnc(req.cookies.Token);
        profile(cookie).then((data) => {
            var cookieData = data.data;
            tokenauth.admauthresult(req, function (aResult) {
                if (aResult == true) {
                    res.render("temp/notice/writeBoard", {select: "notices", u_data: cookieData.username});
                } else {
                    res.render("temp/notice/alert");
                }
            });
        });
    } else {
        res.render("temp/notice/alert");
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            console.log(req.body.fid);
            cb(null, "../file");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

  // upload 액션 처리
router.post("/upload", checkCookie, upload.single("file"), function (req, res) {
    const cookie = req.cookies.Token;
    const title = req.body.title;
    const contents = req.body.contents;
    profile(cookie).then((data) => {
            var userId = data.data.username;
             db.query(
                 `INSERT INTO notices
                  VALUES (NULL, '${userId}', '${title}', '${contents}', '${req.file ? req.file.originalname : "null"}', '${seoultime}', '${seoultime}')`,
            function (error, results) {
                if (error) {
                    throw error;
                }
            }
        );
    });
    const proxy = httpProxy.createProxyServer({});
    proxyUrl = api_url + "/api/notice"
    proxy.web(req, res, { target: proxyUrl });
    res.redirect("../viewBoard");
});

module.exports = router;