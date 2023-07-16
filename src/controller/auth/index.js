import { ValidationError } from "yup";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import moment from "moment";

import * as config from "../../config/index.js"
import * as helpers from "../../helper/index.js"
import * as error from "../../middleware/error.handler.js"
import db from "../../database/index.js";
import * as validation from "./validation.js";
import { User } from "../../models/relation.js";

const cache = new Map();

export const Register = async (req, res, next) => {
    try{
        //Create Transaction
        const transaction = await db.sequelize.transaction();

        //validation
        const {username, password, email, phone} = req.body;
        await validation.RegisterValidationSchema.validate(req.body);

        //check if user already exists
        const userExists = await User?.findOne({where : {username, email}});
        if (userExists) throw ({ status : 400, message : error.USER_ALREADY_EXISTS});

        //create user => encrypt password
        const hashedPassword = helpers.hashPassword(password);

        //generate otp token
        const otpToken = helpers.generateOtp();

        //archive user data
        const user = await User?.create({
            username,
            password : hashedPassword,
            email,
            phone,
            otp : otpToken,
            expiredOtp : moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss")
        });

        //@delete unused data from response
        delete user?.dataValues?.password;
        delete user?.dataValues?.otp;
        delete user?.dataValues?.expiredOtp;

        //generate excess token
        const accessToken = helpers.createToken({uuid : user?.dataValues?.uuid, role : user?.dataValues?.role});

        //send response
        res.header("Authorization",`Bearer ${accessToken}`)
            .status(200)
            .json({
                message : "User created successfully",
                user
            });

        //generate email message
        const template = fs.readFileSync(path.join(process.cwd(),"templates","verify.html"),"utf8");
        const message = handlebars.compile(template)({otpToken, link : config.REDIRECT_URL + `auth/verify/reg-${user?.dataValues?.uuid}`})

        //@send verification email
        const mailOptions = {
            from : config.GMAIL,
            to : email,
            subject : "Verification",
            html : message
        }
        helpers.transporter.sendMail(mailOptions,(error,info)=>{
            if(error) throw error;
            console.log("Email sent:"+info.response);
        })

        //@commit transaction
        await transaction.commit();
    }catch(error){
        next(error)
    }
}

export const Verification = async (req, res, next) => {
    try{
        //@get token from params
        const {uuid, token} = req.body;

        //@check context
        const context = uuid.split("-")[0];
        const userId = uuid.split("-")?.slice(1)?.join("-");

        //@check if user exists
        const user = await User?.findOne({ where : {uuid : userId}});
        if(!user) throw ({status : 400, message : error.USER_DOES_NOT_EXISTS});

        //@verify token
        if(token !== user?.dataValues?.otp) throw ({status : 400, message : error.INVALID_CREDENTIALS});

        //@check if token is expired
        const isExpired = moment().isAfter(user?.dataValues?.expiredOtp);
        if(isExpired) throw ({status : 400, message : error.INVALID_CREDENTIALS});

        //check context
        if(context === "reg"){
            await User?.update({ isVerified : "true", otp : null, expiredOtp : null},{where : {uuid : userId}});
        }

        res.status(200).json({message : "Account verified successfully" , data : uuid})
    }catch(error){
        next(error)
    }
}

export const requestOtp = async (req, res, next) => {
    try{
        //@get user email, context from body (reg/reset)
        const {email, context} = req.body;

        //check if user exists
        const user = await User?.findOne({where : {email}});
        if(!user) throw ({ status : 400, message : error.USER_DOES_NOT_EXISTS});

        //@generate otp token
        const otpToken = helpers.generateOtp();

        //@update user otp token
        await User?.update({otp : otpToken, expiredOtp : moment().add(1,"days").format("YYYY-MM-DD HH:mm:ss")},{where:{email}});

        //@generate email message
        const template = fs.readFileSync(path.join(process.cwd(), "templates","verify.html"),"utf8");
        const message = handlebars.compile(template)({otpToken, link:config.REDIRECT_URL+`/auth/verify/${context}-${user?.dataValues?.uuid}`})

        //@send verification email
        const mailOptions = {
            from : config.GMAIL,
            to : email,
            subject : "Verification",
            html : message
        }
        helpers.transporter.sendMail(mailOptions,(error,info)=>{
            if(error) throw error;
            console.log("Email sent :"+info.response);
        })
        res.status(200).json({message : "Otp token requested successfully."})
    }catch(error){
        next(error)
    }
}

export const Login = async (req, res, next) => {
    try{
        const {username, password} = req.body;
        await validation.LoginValidationSchema.validate(req.body);

        const query = {username}

        //check if user exists include profile
        const userExists = await User?.findOne({where : query});
        if(!userExists) throw ({status : 400, message : error.USER_DOES_NOT_EXISTS})

        //check if password is correct
        const isPasswordCorrect = helpers.comparePassword(password, userExists?.dataValues?.password);
        if(!isPasswordCorrect) throw ({status:400, message:error.INVALID_CREDENTIALS});

        //check token in cache
        const cachedToken = cache.get(userExists?.dataValues?.uuid)
        const isValid = cachedToken && helpers.verifyToken(cachedToken)
        let accessToken = null
        if(cachedToken && isValid){
            accessToken = cachedToken
        }else{
            //generate access token
            accessToken = helpers.createToken({uuid : userExists?.dataValues?.uuid, role : userExists?.dataValues?.role});
            cache.set(userExists?.dataValues?.uuid,accessToken)
        }

        //delete password from response
        delete userExists?.dataValues?.password;
        delete userExists?.dataValues?.otp;
        delete userExists?.dataValues?.expiredOtp;

        res.header("Authorization",`Bearer ${accessToken}`)
            .status(200)
            .json({user : userExists})
    }catch(error){
        if (error instanceof ValidationError){
            return next({ status : 400, message : error?.errors?.[0]})
        }
        next(error)
    }
}

export const KeepLogin = async (req, res, next) => {
    try{
        
        //get user id
        const {uuid} = req.user;
        //get user data
        const user = await User?.findOne({where : uuid})

        //delete password from response
        delete user?.dataValues?.password;
        delete user?.dataValues?.otp;
        delete user?.dataValues?.expiredOtp;

        res.status(200).json({ user })
    }catch(error){
        next(error);
    }
}

export const ForgetPassword = async (req, res, next) => {
    try{
        const {email} = req.body;

        const userExists = await User?.findOne({where : {email : email}});
        if(!userExists) throw ({status : 400, message : error.USER_DOES_NOT_EXISTS});

        const otpToken = helpers.generateOtp();
        await User?.update({otp : otpToken, expiredOtp : moment().add(1,"days").format("YYYY-MM-DD HH:mm:ss")},{where : {email : email}})

        const template = fs.readFileSync(path.join(process.cwd(),"templates","forget.html"),"utf8");
        const message = handlebars.compile(template)({otpToken, link:config.REDIRECT_URL+`/auth/reset/for-${userExists?.dataValues?.uuid}`})

        const mailOptions = {
            from : config.GMAIL,
            to : email,
            subject : "ForgetPassword",
            html : message
        }
        helpers.transporter.sendMail(mailOptions,(error,info)=>{
            if(error) throw error;
            console.log("Email sent :"+info.response);
        })

        res.status(200).json({ message : "Email sent to forget password. Check your email."})
    }catch(error){
        next(error)
    }
}

export const ResetPassword = async (req, res, next) => {
    try{
        const {uuid, token, newPassword} = req.body;

        const context = uuid.split("-")[0];
        const userId = uuid.split("-")?.slice(1)?.join("-");

        const user = await User?.findOne({where : {uuid : userId}});
        if(!user) throw ({status : 400, message : error.USER_DOES_NOT_EXISTS});

        if(token !== user?.dataValues?.otp) throw ({status : 400, message : error.INVALID_CREDENTIALS});

        const isExpired = moment().isAfter(user?.dataValues?.expiredOtp);
        if(isExpired) throw ({status : 400, message : error.INVALID_CREDENTIALS});

        if(context === "for"){
            await User?.update({ password : newPassword, otp : null, expiredOtp : null},{where : {uuid : userId}});
        }

        res.status(200).json({message : "Password reset!"})
    }catch(error){
        next(error)
    }
}

export const ChangeUsername = async (req, res, next) => {
    try{
        const {currentUsername, newUsername} = req.body;
        await validation.ChangeUsernameSchema.validate(req.body);
        await User.update({username : newUsername},{where : {username : currentUsername}})
        res.status(200).json({message : "Username changed!"})
    }catch(error){
        next(error)
    }
}

export const ChangePassword = async (req, res, next) => {
    try{
        const {currentPassword, newPassword} = req.body;
        await validation.ChangePasswordSchema.validate(req.body);
        const hashedOldPassword = helpers.hashPassword(currentPassword);
        const hashedNewPassword = helpers.hashPassword(newPassword);
        await User.update({password : hashedNewPassword},{where : {password : hashedOldPassword}})
        res.status(200).json({message : "Password changed!"})
    }catch(error){
        next(error)
    }
}

export const ChangePhone = async (req, res, next) => {
    try{
        const {currentPhone, newPhone} = req.body;
        await validation.ChangePhoneSchema.validate(req.body);
        await User.update({phone : newPhone},{where : {phone : currentPhone}})
        res.status(200).json({message : "Phone changed!"})
    }catch(error){
        next(error)
    }
}

export const ChangeEmail = async (req, res, next) => {
    try{
        const {currentEmail, newEmail} = req.body;
        await validation.ChangeEmailSchema.validate(req.body);
        await User.update({email : newEmail},{where : {email : currentEmail}})
        res.status(200).json({message : "Email changed!"})
    }catch(error){
        next(error)
    }
}

export const UploadProfilePicture = async (req, res, next) => {
    try{
        
        const uuid = req.body.id;
        console.log("Test : ", req.body.id)

        if(!req.file){
            throw new({status : 400, message : "Please upload an image."})
        }
        const imageURL = "public/images/profiles/"+req?.file?.filename
        await User?.update({profilePicture : imageURL},{where : {userId : uuid}})
        res.status(200).json({message : "Image uploaded successfully.",imageUrl : imageURL})
    }catch(error){
        next(error)
    }
}