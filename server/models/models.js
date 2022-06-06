const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
});

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    total: {type: DataTypes.DOUBLE, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.BOOLEAN, allowNull: false},
});

const Wallet = sequelize.define('wallet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    total: {type: DataTypes.DOUBLE, allowNull: false},
});

User.hasOne(Post);
Post.belongsTo(User);

User.hasOne(Wallet);
Wallet.belongsTo(User);

module.exports = {
    User,
    Post,
    Wallet,
};