const Router = require('express');
const router = new Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/authMiddleware')

router.post('/', auth, postController.create);
router.get('/:userId', auth, postController.getAll);

module.exports = router;