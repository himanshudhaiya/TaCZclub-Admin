const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const BlogController = require("../../controllers/admin/BlogController");

router.get("/list", NotLoggedIn, BlogController.blogList);
router.post("/add", NotLoggedIn, BlogController.blogPost);
// router.post("/editblog", NotLoggedIn, BlogController.edit);
router.post("/delete", NotLoggedIn, BlogController.delete);

module.exports = router;
