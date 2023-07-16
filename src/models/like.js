import db from "../database/index.js";

export const Like = db.sequelize.define("like",{
    userId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
    },
    blogId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true
    }
},{
    tableName : "like",
    timestamps : false
})