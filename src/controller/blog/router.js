import { Router } from "express";
import * as BlogController from "./index.js";
import { createUploader } from "../../helper/uploader.js";
import { verifyUser } from "../../middleware/token.verify.js";

const uploader = createUploader("./public/images/blogposts")
const routes = new Router()

routes.post("/",verifyUser,uploader.single("file"),BlogController.createBlog);
routes.get("/",BlogController.getAllBlogs);
routes.get("/:id",BlogController.getBlogById);
routes.patch("/delete",BlogController.deleteBlog);

export default routes