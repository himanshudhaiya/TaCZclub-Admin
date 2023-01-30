const router = require("express").Router();
const trending = require("../../controllers/app/trendingController");
const {
    NotLoggedIn
} = require("../../middlewares/Appauth");


router.get("/list", trending.trendingList);

module.exports = router;