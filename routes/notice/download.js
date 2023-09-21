var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const id = req.header("referrer").split("id=")[1]
    const url = req.query.url

    res.download(url)
})

module.exports = router;