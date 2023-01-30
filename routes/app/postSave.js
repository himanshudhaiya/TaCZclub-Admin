const postsave = require("../../controllers/app/postsaveController");
const router = require("express").Router();

router.post("/add", postsave.add);


module.exports = router;