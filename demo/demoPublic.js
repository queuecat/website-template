// 引用express框架
const express = require('express');
// 创建路由对象
const public = express.Router();
// 引入系统模块path获取目录
const path = require('path');

// 静态资源
//console.log(path.join(__dirname, '../public'));
public.use(express.static(path.join(__dirname)));
module.exports = public;