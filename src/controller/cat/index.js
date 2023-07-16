import {Category} from "../../models/category.js";

export const getAllCategory = async (req, res, next) => {
    try{
        const category = await Category.findAll();
        res.status(200).json({
            type : "success",
            message : "",
            data : {category}
        })
    }catch(error){
        next(error)
    }
}