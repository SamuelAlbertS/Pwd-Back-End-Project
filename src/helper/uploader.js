import multer from "multer"
import path from "path"
import * as config from "../config/index.js"

//configure storage
export const createDiskStorage = (directory) => multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, directory)
    },
    filename : (req, file, cb) => {
        cb(null, "IMG"+"-"+Date.now()+path.extname(file.originalname))
    }
})

//configure upload
export const createUploader = (directory) => multer({
    storage : createDiskStorage(directory),
    limits : {fileSize : 1000000},
    fileFilter : (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if(!extname){
            return cb(new Error("Error : Images only!"),false)
        }
        cb(null,true)
    }
})