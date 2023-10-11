var db = require("../../middlewares/db");
var {seoultime} = require("../../middlewares/seoultime");
var express = require("express");
var router = express.Router();
var tokenauth = require("./tokenauth");
var {decryptEnc,} = require("../../middlewares/crypt");
const profile = require("../../middlewares/profile");
const multer = require("multer");
const checkCookie = require("../../middlewares/checkCookie");
var request = require("request");
const fs = require("fs");

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            console.log(req.body.fid);
            cb(null, "./");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

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

router.post(
    "/write",
    checkCookie,
    upload.single("imgimg"), // 파일 업로드 설정
    function (req, res, next) {
        const { title, contents } = req.body;

        // 클라이언트의 쿠키를 사용하여 사용자 프로필 정보를 가져옵니다.
        const cookie = req.cookies.Token;
        profile(cookie).then((data) => {
            var userId = data.data.username;

            // 파일 업로드는 그대로 유지

            // 데이터를 다른 서버로 전송
            request.post({
                url: 'http://127.0.0.1:3000/api/notice/test/', // 변경된 API 주소
                formData: {
                    title: title,
                    contents: contents,
                    userId: userId,
                    imgimg: fs.createReadStream(req.file.path), // 파일 업로드 필드와 파일 경로
                },
            }, function (error, response, body) {
                if (error) {
                    // 오류 처리
                    throw error;
                }

                // 데이터베이스에 데이터를 삽입
                db.query(
                    `INSERT INTO notices
                     VALUES (NULL, '${userId}', '${title}', '${contents}', '${req.file.originalname}', '${seoultime}', '${seoultime}')`,
                    function (error, results) {
                        if (error) {
                            throw error;
                        }
                        res.redirect("../viewBoard");
                    }
                );
            });
        });
    }
);

module.exports = router;
