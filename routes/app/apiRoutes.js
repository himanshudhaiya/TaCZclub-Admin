const router = require("express").Router();
const {
  NotLoggedIn
} = require("../../middlewares/Appauth");
const ApiController = require("../../controllers/app/apiController");

router.get("/about", NotLoggedIn, ApiController.about);
router.get("/banner", NotLoggedIn, ApiController.banner);
router.get("/contact", NotLoggedIn, ApiController.contact);
router.get("/faq", NotLoggedIn, ApiController.faq);
router.get("/slider", NotLoggedIn, ApiController.slider);
router.get("/privacypolicy", NotLoggedIn, ApiController.privacypolicy);
router.get("/termscondition", NotLoggedIn, ApiController.termscondition);
router.get("/category", NotLoggedIn, ApiController.category)
router.get("/blog", NotLoggedIn, ApiController.blog)

router.get("/post-list", NotLoggedIn, ApiController.post);
router.post("/post/likes-list", NotLoggedIn, ApiController.post_likes);
router.post("/post/comments-list", NotLoggedIn, ApiController.post_comment);

router.get("/shortVideo-list", NotLoggedIn, ApiController.shortVideo);
router.post("/shortVideo/likes-list", NotLoggedIn, ApiController.shortVideo_likes);
router.post("/shortVideo/comments-list", NotLoggedIn, ApiController.shortVideo_comment);

router.post("/shortVideo/views-list", NotLoggedIn, ApiController.shortVideo_views);
router.get("/user-post-shortVideo", NotLoggedIn, ApiController.user_post);

router.get("/post-Saved/list", NotLoggedIn, ApiController.postSave);

router.get("/following-user-list", NotLoggedIn, ApiController.following);
router.get("/followers-user-list", NotLoggedIn, ApiController.followers);
router.get("/following-post-list", NotLoggedIn, ApiController.followingPostlist);

router.get("/reply-user", NotLoggedIn, ApiController.reply);

router.get("/googleAds", NotLoggedIn, ApiController.googleAds)

router.post("/comment-reply", NotLoggedIn, ApiController.commentReply)

router.post("/user/withdraw-money", NotLoggedIn, ApiController.debit_money_from_wallet);

module.exports = router;