import { ValidationError } from "yup";
import { Blog } from "../../models/blog.js";
import { BAD_REQUEST } from "../../middleware/error.handler.js";

export const createBlog = async(req, res, next)=>{
    try{
        const {data} = req.body;
        const body = JSON.parse(data);
        const {title, userId, content, keywords, categoryId} = body

        const BlogExists = await Blog?.findOne({where : {title}});
        if (BlogExists) throw ({status : 400, message : "Blog already exists."})

        const newBlog = await Blog?.create({title, userId, content, keywords, categoryId, image : req?.file?.path})

        res.status(201).json({type : "success", message : "Blog done!", data : newBlog});
    }catch(error){
        if(error instanceof ValidationError){
            return next({status : 400, message : error?.errors?.[0]})
        }
        next(error);
    }
}

export const getBlogById = async (req, res, next) => {
    try{
        const {id} = req.params;

        const blogged = await Blog?.findOne({where : {id}})

        res.status(200).json({type : "success", message : "Blog get.", data : blogged})
    }catch(error){
        next(error)
    }
}

export const getAllBlogs = async (req, res, next) => {
    try{
        const {page, limit} = req.query;

        const options = {
            offset : page > 1 ? parseInt(page - 1)*parseInt(limit) : 0,
            limit : limit ? parseInt(limit) : 10,
        }

        const blogs = await Blog?.findAll({...options});
        const total = await Blog?.count();
        const pages = Math.ceil(total/options.limit);

        res.status(200).json({
            type : "success",
            message : "Blog successfully get!",
            data : {
                blogs,
                total_elements : total,
                current_page : page,
                next_page : page < pages ? parseInt(page)+1:null,
                total_pages : pages,
            }
        })
    }catch(error){
        next(error)
    }
}

export const deleteBlog = async (req, res, next) => {
    try{
        const {blogId} = req.body;

        const deleted = await Blog?.destroy({where : {blogId : blogId}})

        res.status(200).json({message : "Blog deleted.", data : deleted})
    }catch(error){
        next(error)
    }
}