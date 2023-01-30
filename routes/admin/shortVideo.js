const router = require("express").Router();
const shortvideo = require("../../controllers/admin/shortVideoController")

router.get("/list", shortvideo.list)
router.get("/view/:id", shortvideo.shortVideoView)
router.post("/edit", shortvideo.edit)


module.exports = router;