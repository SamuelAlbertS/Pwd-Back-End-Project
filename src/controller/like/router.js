import { Router } from "express";
import * as LikeController from "./index.js";
import { verifyUser } from "../../middleware/index.js";

const routes = new Router();

routes.get("/list",verifyUser,LikeController.FavoriteBlog);
routes.post("/send",verifyUser,LikeController.SendLike);

export default routes;