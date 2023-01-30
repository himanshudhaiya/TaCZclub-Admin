const notification = require('../../controllers/app/notificationController');
const router = require('express').Router();
const {
    NotLoggedIn
} = require('../../middlewares/Appauth');

router.get('/get', NotLoggedIn, notification.get);

module.exports = router;