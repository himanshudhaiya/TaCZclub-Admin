const router = require('express').Router();
const Currency = require('../../controllers/admin/currencyController');

router.get('/list', Currency.getCurrency);
router.post('/addcurrency', Currency.addcurrency);
router.post('/deletecurrency', Currency.deletecurrency);

module.exports = router;