const report = require('../../controllers/app/reportControllrt');
const router = require('express').Router();

router.post('/add', report.add);


module.exports = router;