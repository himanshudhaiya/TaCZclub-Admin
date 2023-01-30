const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const PrivacyPolicyController = require("../../controllers/admin/privacypolicyController");

router.get(
  "/privacypolicy",
  NotLoggedIn,
  PrivacyPolicyController.privacypolicyGET
);
router.post(
  "/privacypolicy",
  NotLoggedIn,
  PrivacyPolicyController.privacypolicyPOST
);

module.exports = router;
