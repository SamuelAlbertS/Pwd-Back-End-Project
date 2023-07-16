import db from "../database/index.js";

export const Blog = db.sequelize.define("blog",{
    blogId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false      
    },
    title : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    userId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    },
    content : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    image : {
        type : db.Sequelize.STRING
    },
    keywords : {
        type : db.Sequelize.STRING,
        allowNull : false
    },
    categoryId : {
        type : db.Sequelize.INTEGER,
        allowNull : false
    }
},{
    tableName : "blog",
    timestamps : true
})