import db from "../database/index.js";

export const Category = db.sequelize.define("category",{
    categoryId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    },
    categoryName : {
        type : db.Sequelize.STRING
    }
},{
    tableName : 'category',
    timestamps : false
})