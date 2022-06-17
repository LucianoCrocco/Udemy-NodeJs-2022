const sequelize = require("../helpers/database");
const Sequelize = require("sequelize");

const OrderItem = sequelize.define("orderItem", {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    quantity : Sequelize.INTEGER 
})

module.exports = OrderItem;