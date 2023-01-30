const router = require("express").Router();
const post = require("../../controllers/admin/postController");

router.get("/list", post.list);
router.get("/View", post.postView);
router.post("/edit", post.edit)


module.exports = router;