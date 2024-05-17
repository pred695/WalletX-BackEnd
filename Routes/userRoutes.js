const {Router} = require('express')
const router = Router();
const UserController = require('../Controllers/userController')
const {verifyUser} = require('../MiddleWares/authMiddleWare')

//public routes.
router.post('/signup', UserController.signUp);
router.post('/login', UserController.logIn);

//private routes.
router.get('/info', verifyUser, UserController.fetch);
router.get('/info/:username', verifyUser, UserController.search);
router.get('/logout', verifyUser, UserController.logOut);

module.exports = router;