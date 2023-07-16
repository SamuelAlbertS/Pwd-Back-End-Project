import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import * as middleware from "./src/middleware/index.js";
import cors from "cors";
import CategoryRoutes from "./src/controller/cat/router.js";
import AuthRoutes from "./src/controller/auth/routers.js";
import BlogRoutes from "./src/controller/blog/router.js";
import LikeRoutes from "./src/controller/like/router.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors({ exposedHeaders : "Authorization"}))
app.use(middleware.requestLogger)
app.use("/public",express.static("public"))

app.get("/", (req, res) => {
    res.status(200).send("<h1>Welcome to my REST-API</h1>")
})

app.use("/api/category",CategoryRoutes)
app.use("/api/auth",AuthRoutes)
app.use("/api/blog",BlogRoutes)
app.use("/api/like",LikeRoutes)

app.use(middleware.errorHandler);



app.listen(5000, ()=>{
    console.log(`server is running at 5000`);
})