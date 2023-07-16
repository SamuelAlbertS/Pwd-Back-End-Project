import { User } from "./user.js";
import { Blog } from "./blog.js";
import { Category } from "./category.js";
import { Like } from "./like.js";

//@define relation
User.hasMany(Blog, {foreignKey : "userId"})
Blog.belongsTo(User, {foreignKey : "userId"})
User.hasMany(Like, {foreignKey : "userId"})
Like.belongsTo(User, {foreignKey : "userId"})
Blog.hasMany(Like, {foreignKey : "blogId"})
Like.belongsTo(User, {foreignKey : "blogId"})
Blog.hasOne(Category, {foreignKey : "categoryId"})
Category.belongsTo(Blog, {foreignKey : "categoryId"})

export {User, Category, Blog, Like}