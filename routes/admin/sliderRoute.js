const router = require("express").Router();
const SliderController = require("../../controllers/admin/sliderController");

router.get("/list", SliderController.list);
router.post("/add", SliderController.add);
router.post("/delete", SliderController.delete);

module.exports = router;
