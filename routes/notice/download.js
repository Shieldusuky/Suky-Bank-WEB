var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const url = req.query.url
    apidownurl = api_url + "/api/notice/download?filename=" + url
    res.redirect(apidownurl)
})

module.exports = router;