const {Post} = require('../models/models');
const ApiError = require('../error/ApiError');

class PostController {
    async create(req, res, next) {
        try {
            const {total, type, category, userId} = req.body;

            const post = await Post.create({total, type, category, userId});

            return res.json(post);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const {userId} = req.params;
        let {page, limit} = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let posts = await Post.findAndCountAll({
            limit,
            offset,
            where: {userId},
        });
        return res.json(posts);
    }
}

module.exports = new PostController();