import { Router } from "express"

import * as CategoryController from "./index.js"

const routes = new Router()

routes.get("/",CategoryController.getAllCategory)

export default routes