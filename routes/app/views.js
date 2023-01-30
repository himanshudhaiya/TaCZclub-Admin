const views = require("../../controllers/app/viewsController");
const router = require("express").Router();

router.post("/add", views.addView);

module.exports = router;