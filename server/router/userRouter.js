const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth/:email', auth, userController.check);

module.exports = router;