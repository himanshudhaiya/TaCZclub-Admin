const router = require("express").Router()
const Support_messages = require("../../controllers/app/supportMessagesController")

router.post("/add", Support_messages.add)

module.exports = router;