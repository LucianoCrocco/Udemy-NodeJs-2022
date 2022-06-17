const sequelize = require("../helpers/database");
const Sequelize = require("sequelize");

const User = sequelize.define("user", {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false
    }
})

module.exports = User;