const router = require("express").Router();
const GoogleAds = require("../../controllers/admin/googleAdsController");

router.get("/list", GoogleAds.list);
router.post("/add", GoogleAds.add);
router.post("/edit", GoogleAds.edit);
router.post("/delete", GoogleAds.delete);

module.exports = router;