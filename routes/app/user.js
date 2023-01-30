const router = require("express").Router();
const user = require("../../controllers/app/authController");

router.post("/login", user.login)
router.post("/otp_verify", user.verify_otp)
router.post("/register", user.register)

router.post("/profile-update", user.profile_update)

router.post("/post_like", user.post_like);
router.post("/post_comment", user.post_comment)

router.post("/followers", user.Followers)
router.post("/following", user.following)

module.exports = router;