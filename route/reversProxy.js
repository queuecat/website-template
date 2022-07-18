// 引用express框架
const express = require('express');
// 创建路由对象
const proxy = express.Router();
// 引入转发三方库
const httpProxy = require('http-proxy');
const path = {
	// localhost
	'qb.localhost': 'http://localhost:3001',
	'resumeprint.localhost': 'http://localhost:3000/demos/resumePrint',
};

// 判断请求地址，进行跳转
proxy.use((req, res, next) => {
	// console.log(req.hostname, req.url);
	//res.redirect(req.url);
  try {
    if (path[req.hostname]&& !req.headers.isforward) {
      // console.log("代理"+req.hostname);
      // res.redirect(path[req.hostname] + req.url);
      const proxy = httpProxy.createProxyServer({headers:{'isforward':true}});
      proxy.web(req, res, { target: path[req.hostname] });
    } else {next()};
  } catch (e) {
    next("反向代理错误"+req.hostname);
  }
});

//导出路由对象
module.exports = proxy;
