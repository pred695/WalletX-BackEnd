const {Router} = require('express')
const router = Router();
const ItemController = require('../Controllers/itemController')
const {verifyUser} = require('../MiddleWares/authMiddleWare')

router.post('/watchlist', ItemController.addToWatchList);
router.get('/watchlist', verifyUser, ItemController.fetchWatchList);
router.delete('/watchlist/:asset_id', ItemController.removeAsset);
module.exports = router;