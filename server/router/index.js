const Router = require('express');
const router = new Router();

const postRouter = require('./postRouter');
const userRouter = require('./userRouter');
const walletRouter = require('./walletRouter');

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/wallet', walletRouter);

module.exports = router;