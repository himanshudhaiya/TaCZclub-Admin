const router = require("express").Router();
const post = require("../../controllers/app/postController");

router.post("/add", post.add);
router.get("/list", post.list);

module.exports = router;