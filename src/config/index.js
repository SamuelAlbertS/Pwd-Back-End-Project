/**
    import mysql from "mysql2";
    import dotenv from "dotenv";
    
    dotenv.config();
        
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATA
    })
    
    connection.connect((err)=>{
        if(err){
            console.error('Error connection :',err)
            return;
        }
        console.log('connected to the database');
    })
        
    export default connection
*/

import dotenv from "dotenv";
dotenv.config();

//create db configuration
const db_config = Object.freeze({
    development : {
        username : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        host     : process.env.DB_HOST,
        dialect  : "mysql"
    },
    test : {
        username : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        host     : process.env.DB_HOST,
        dialect  : "mysql"
    },
    production : {
        username : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        host     : process.env.DB_HOST,
        dialect  : "mysql"
    }
})

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const GMAIL_APP_KEY = process.env.GMAIL_APP_KEY
export const GMAIL = process.env.GMAIL
export const REDIRECT_URL = process.env.REDIRECT_URL

export default db_config[process.env.NODE_ENV || 'development']
