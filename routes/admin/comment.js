const router = require("express").Router();
const comment = require("../../controllers/admin/commentController")


router.get("/list", comment.list)
router.post("/edit", comment.edit)
router.post("/delete", comment.delete)

module.exports = router;