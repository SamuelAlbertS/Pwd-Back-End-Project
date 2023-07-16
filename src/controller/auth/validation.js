import * as Yup from "yup"

export const RegisterValidationSchema = Yup.object({
    username : Yup.string().required("Username is required"),
    password : Yup.string().required("Password is required"),
    email : Yup.string().email("Invalid email").required("Email is required"),
    phone : Yup.string().required("Phone is required")
})

export const LoginValidationSchema = Yup.object({
    username : Yup.string().required("Username is required"),
    password : Yup.string().required("Password is required")
})

export const ForgetPasswordSchema = Yup.object({
    email : Yup.string().email("Invalid email").required("Email is required")
})

export const ResetPasswordSchema = Yup.object({
    newPassword : Yup.string().required("New Password is required")
})

export const ChangePasswordSchema = Yup.object({
    currentPassword : Yup.string().required("Password is required"),
    newPassword : Yup.string().required("New Password is required")
})

export const ChangeEmailSchema = Yup.object({
    currentEmail : Yup.string().email("Invalid email").required("Email is required"),
    newEmail : Yup.string().email("Invalid email").required("New Email is required")
})

export const ChangePhoneSchema = Yup.object({
    currentPhone : Yup.string().required("Phone is required"),
    newPhone : Yup.string().required("New Phone is required")
})

export const ChangeUsernameSchema = Yup.object({
    currentUsername : Yup.string().required("Username is required"),
    newUsername : Yup.string().required("New Username is required")
})