const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const {User, Post} = require('../models/models');
const {etag} = require("express/lib/utils");

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'},
    );
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body;
        if(!email || !password) {
            return next(ApiError.badRequest('Некорректный email или пароль'));
        }
        const candidate = await User.findOne({where: {email}});
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = User.create({email, role, password: hashPassword});
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if(!user) {
            return next(ApiError.internal('Пользователь не найден'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'));
        }
        const token = generateJwt(user.id, user.email, user.role);
        const id = user.id;
        return res.json({token, id});
    }

    async check(req, res, next) {
        const {email} = req.params;
        const user = await User.findOne({where: {email}});
        const token = generateJwt(user.id, user.email, user.role);
        const id = user.id;
        return res.json({token, id});
    }
}

module.exports = new UserController();