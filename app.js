// 引用express框架
const express = require('express');
// 创建网站服务器
const app = express();
// 引入系统模块path获取目录
const path = require('path');
// 引用fs模块
const fs = require('fs');
// 引入gzip压缩方法
const compression = require('compression');
//引入DateFormat方法
require('./Tools/DateFormat')
//引入http模块
const http = require('http');
const https = require('https');
// server
// const options = {
//     key: fs.readFileSync(path.join(__dirname, '../https', 'queuecat.top.key')),
//     cert: fs.readFileSync(path.join(__dirname, '../https', 'queuecat.top.pem'))
// };
//配置https对象
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(options, app);
//开放网站服务器对象
module.exports = app;



// 一级路由
const router = {
    proxy: require("./route/reversProxy"),
    home: require("./route/home"),
    note: require("./demo/笔记/note"),
    demos: require("./route/demos"),
    upload: require("./route/upload")
};

// 反向代理
app.use(router.proxy);
// gzip压缩
app.use(compression())
//案例项目
app.use('/demos', router.demos);
//根目录路由(返回静态主页等)
app.use('/', router.home);
//项目封面文件上传
app.use('/upload', router.upload);
//笔记
app.use('/note', router.note)

// 404
app.use(require('./route/404'));


//错误处理
app.use((err, req, res, next) => {
    console.log("\033[41;30m 异常错误 \033[0m", new Date().Format("yyyy-MM-dd hh:mm:ss"), '接收到 ' + req.url + ' 抛出的异常 ' + err);
    console.log(err);
    try {
        res.status(500).send({ message: err.message });
    } catch (err) {
        console.log("\033[41;30m 异常处理时发生错误 \033[0m", new Date().Format("yyyy-MM-dd hh:mm:ss"), '接收到 ' + req.url + ' 抛出的异常 ' + err);

    }
});

// 监听端口
httpServer.listen(3000, () => console.log("\033[42;30m 成功 \033[0m", '服务器启动成功'));
//httpsServer.listen(443, () => console.log("\033[42;30m 成功 \033[0m", '服务器启动成功 on port 443'));