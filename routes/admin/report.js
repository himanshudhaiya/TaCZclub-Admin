const report = require('../../controllers/admin/reportController');
const router = require('express').Router();


router.get('/list', report.list);
router.post('/delete', report.delete);
router.post('/edit', report.edit);

module.exports = router;