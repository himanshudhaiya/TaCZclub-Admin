const router = require("express").Router();
const user = require("../../controllers/admin/userController")

router.get("/list", user.appuser)
router.get("/view", user.userWalletViews)
router.get("/postView", user.userpostView)
router.get("/shoerVideo", user.userWallet_ShortVideo_Views)

module.exports = router;