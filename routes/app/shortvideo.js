const router = require("express").Router();
const ShortVideo = require("../../controllers/app/shortVideoController");

router.post("/add", ShortVideo.add);

module.exports = router;