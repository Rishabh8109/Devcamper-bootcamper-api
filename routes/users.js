const express = require('express');
const router = express.Router();
const {getUsers, getSingleUser, updateUser , deleteUser, createUser} = require('../controllers/users')
const advanceResult = require('../middleware/advanceResult');
const User = require('../modals/User');

// import security middlewares
const {protect} = require('../middleware/auth');
const {roleAuthorization}  = require('../middleware/authorize');

// Route security middleware
router.use(protect);
router.use(roleAuthorization('admin'));

router.route('/')
       .get(advanceResult(User) , getUsers)
       .post(createUser)

router.route('/:id')
       .get(getSingleUser)
       .put(updateUser)
       .delete(deleteUser)

module.exports = router;