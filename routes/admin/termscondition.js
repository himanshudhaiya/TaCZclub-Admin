const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const TermsConditionController = require("../../controllers/admin/termsconditionController");

router.get(
    "/termscondition",
    NotLoggedIn,
    TermsConditionController.termsconditionGET
);
router.post(
    "/termscondition",
    NotLoggedIn,
    TermsConditionController.termsconditionPOST
);

module.exports = router;
