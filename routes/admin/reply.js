const router = require("express").Router();
const reply = require("../../controllers/admin/replyComtroller");

router.get("/list/:id", reply.list);
router.post("/add", reply.add);


module.exports = router;