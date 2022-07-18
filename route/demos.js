// 引用express框架
const express = require('express');
const { Demos } = require('./mongo');

// 创建路由对象
const demos = express.Router();
// 二级路由
// const demosRouter = {
//     blog: require("../demo/blog/app"),
//     FileTransshipment: require("../demo/文件中转/app"),
//     FacialFusion: require("../demo/FacialFusion/app")
// };

//案例项目
// //博客
// demos.use('/blog', demosRouter.blog);
// //文件中转站
// demos.use('/FileTransshipment', demosRouter.FileTransshipment);
// //
// demos.use('/FacialFusion', demosRouter.FacialFusion);
//开放静态案例（防止与前面案例冲突，写再最下方）
demos.use('/', require("../demo/demoPublic"));
//导出路由对象
module.exports = demos;