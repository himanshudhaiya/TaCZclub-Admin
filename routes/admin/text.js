const router = require("express").Router();
const text = require("../../controllers/admin/textController");


router.get("/list", text.list);
router.post("/add", text.add);
router.post("/edit", text.edit);


module.exports = router;