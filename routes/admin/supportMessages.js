const router = require("express").Router();
const Support_messages = require("../../controllers/admin/SupporeMessages");

router.get("/list", Support_messages.list);

module.exports = router;