const {Wallet, User} = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require("bcrypt");

class WalletController {
    async create(req, res, next) {
        try {
            const {total, userId} = req.body;

            const wallet = await Wallet.create({total, userId});

            return res.json(wallet);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {total} = req.body;
            const userId = req.params
            const updateWallet = await Wallet.update({total}, {where: userId});
            return res.json({updateWallet});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res) {
        const {userId} = req.params;
        let wallet = await Wallet.findOne({
            where: {userId},
        });
        return res.json(wallet);
    }
}

module.exports = new WalletController();