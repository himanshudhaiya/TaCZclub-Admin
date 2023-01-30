const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const SubCategoryController = require("../../controllers/admin/subcategoryController");

router.get("/list", NotLoggedIn, SubCategoryController.list);
router.post("/add", NotLoggedIn, SubCategoryController.addPOST);
router.post("/edit", NotLoggedIn, SubCategoryController.edit);
router.post("/delete", NotLoggedIn, SubCategoryController.delete);

module.exports = router;
