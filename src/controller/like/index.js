import { Like } from "../../models/like.js";
import { BAD_REQUEST } from "../../middleware/error.handler.js";

export const SendLike = async (req, res, next) => {
    try{
        const {userId, blogId} = req.body;

        const already = await Like?.findOne({where : {userId, blogId}});
        if(already) throw ({status : 400, message : error.BAD_REQUEST});

        const liked = await Like?.create({userId, blogId})

        res.status(200).json({message : "Blog liked!", data : liked});
    }catch(error){
        next(error)
    }
}

export const FavoriteBlog = async (req, res, next) => {
    try{
        const {userId} = req.body;

        const likedList = await Like?.findAll({where : {userId : userId}});
        
        res.status(200).json({message : "Data fetched!", data : likedList});
    }catch(error){
        next(error);
    }
}