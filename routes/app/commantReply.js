const router = require("express").Router();
const CommentReply = require("../../controllers/app/commentReply");


router.post("/add", CommentReply.C_reply);


module.exports = router;