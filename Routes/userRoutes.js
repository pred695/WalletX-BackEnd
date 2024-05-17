const {Router} = require('express')
const router = Router();
const UserController = require('../Controllers/userController')
const {verifyUser} = require('../MiddleWares/authMiddleWare')

//Authentication Routes
router.get('/info', verifyUser, UserController.fetch);
router.get('/info/:username', UserController.search);
router.post('/signup', UserController.signUp);
router.post('/login', UserController.logIn);
router.get('/logout', UserController.logOut);

module.exports = router;