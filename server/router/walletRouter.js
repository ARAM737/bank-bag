const Router = require('express');
const router = new Router();
const walletController = require('../controllers/walletController');
const auth = require('../middleware/authMiddleware')

router.post('/', auth, walletController.create);
router.put('/update/:userId', auth, walletController.update);
router.get('/:userId', auth, walletController.getOne);

module.exports = router;