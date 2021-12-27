const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/saveMyHistory',
  authController.protect,
  userController.saveMyHistory
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  );
module.exports = router;
