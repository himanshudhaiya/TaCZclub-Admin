const router = require("express").Router();
const ReferralCurrency = require("../../controllers/admin/referralCurrencyController");


router.get("/list", ReferralCurrency.list);
router.post("/add", ReferralCurrency.referralCurrency);
router.post("/delete", ReferralCurrency.delete);

module.exports = router;