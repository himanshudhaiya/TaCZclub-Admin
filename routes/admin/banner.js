const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const BannerController = require("../../controllers/admin/bannerController");

router.get("/list", NotLoggedIn, BannerController.list);
router.post("/add", NotLoggedIn, BannerController.add);
router.post("/delete", NotLoggedIn, BannerController.delete);

module.exports = router;
