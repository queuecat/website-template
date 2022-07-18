// 引用express框架
const express = require('express');
// 引入系统模块path获取目录
const path = require('path');
//引入Figlet
const figlet = require('figlet');

const home = express.Router();

// 静态资源
//console.log(path.join(__dirname, '../public'));
home.use(express.static(path.join(__dirname, '../public')));

//返回艺术字
var font = "";
figlet('QueueCat', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    font = data;
});

home.use("/getFont", (req, res) => {
    res.send(font);
});

//导出路由对象
module.exports = home;