import {Router} from "express"
import { verifyUser } from "../../middleware/token.verify.js"
import * as AuthControllers from "./index.js"
import {createUploader, createDiskStorage} from "../../helper/uploader.js"
import path from "path"

const uploader = createUploader("./public/image/profiles")

const routes = new Router()
routes.post("/register",AuthControllers.Register)
routes.post("/login",AuthControllers.Login)
routes.patch("/verify",AuthControllers.Verification)
routes.post("/request-otp",AuthControllers.requestOtp)
routes.get("/keep-login",verifyUser,AuthControllers.KeepLogin)
routes.post("/uploadPicture",verifyUser,uploader.single("file"),AuthControllers.UploadProfilePicture)
routes.patch("/changeUsername",verifyUser,AuthControllers.ChangeUsername)
routes.patch("/changePassword",verifyUser,AuthControllers.ChangePassword)
routes.patch("/changeEmail",verifyUser,AuthControllers.ChangeEmail)
routes.patch("/changePhone",verifyUser,AuthControllers.ChangePhone)
routes.put("/forgetPassword",AuthControllers.ForgetPassword)
routes.patch("/resetPassword",AuthControllers.ResetPassword)

export default routes