const express = require('express');
const { register , login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();


// Router for register
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(protect , getMe);
router.route('/updateDetails/:id').put(protect , updateDetails);
router.route('/updatePassword').put(protect , updatePassword);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resettoken').put(resetPassword);

module.exports = router;