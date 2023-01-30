const router = require("express").Router();
const trendingcount = require("../../controllers/admin/trendingcount");

router.get("/list", trendingcount.getTrendingCount);
router.post("/add", trendingcount.add);
router.post("/delete", trendingcount.delete);


module.exports = router;