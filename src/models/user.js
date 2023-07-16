import db from "../database/index.js";

//@user

export const User = db.sequelize.define("user",{
    userId : {
        type : db.Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull : false
    },
    UUID:{
        type : db.Sequelize.UUID,
        defaultValue : db.Sequelize.UUIDV4,
        allowNull: false
    },
    username:{
        type : db.Sequelize.STRING,
        allowNull : false
    },
    password:{
        type : db.Sequelize.STRING,
        allowNull : false
    },
    phone:{
        type : db.Sequelize.STRING,
        allowNull : false
    },
    email:{
        type : db.Sequelize.STRING,
        allowNull : false
    },
    profilePicture:{
        type : db.Sequelize.STRING,
        allowNull : true
    },
    isVerified : {
        type : db.Sequelize.STRING,
        allowNull : false,
        defaultValue : "false"
    },
    otp : {
        type : db.Sequelize.STRING
    },
    expiredotp : {
        type : db.Sequelize.DATE
    },
    role : {
        type : db.Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 2
    }
},{
    tableName : 'user',
    timestamps : false
})