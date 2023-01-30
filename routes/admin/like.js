const router = require("express").Router();
const like = require("../../controllers/admin/likeController")


router.get("/list", like.list)
router.post("/delete", like.delete)


module.exports = router;