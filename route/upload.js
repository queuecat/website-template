// 引用express框架
const express = require('express');
// 引入数据库处理模块
const mongoose = require('mongoose');
// 处理文件上传
const formidableMiddleware = require('express-formidable');
// 引入系统模块path获取目录
const path = require('path');
// 引入fs模块
const fs = require("fs");

// 数据库连接
mongoose.connect('mongodb://localhost:27017/addDemo', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log("\033[42;30m 成功 \033[0m", '数据库启动成功'))
    .catch((err) => console.log("\033[41;30m 失败 \033[0m", '数据库启动失败' + err));
//引入数据库对象
const { Demos, validateDemos } = require("./mongo");
// 创建路由对象
const upload = express.Router();

// 静态资源
//console.log(path.join(__dirname, '../public'));
upload.use(express.static(path.join(__dirname, '../public')));

// 处理post参数
upload.use(formidableMiddleware({
    // 文件上传目录
    uploadDir: path.join(__dirname, '../public', 'cover'),
    // 最大上传文件为2M
    maxFileSize: 2 * 1024 * 1024,
    // 保留文件扩展名
    keepExtensions: true
}, [{
    event: "error",
    action: () => {
        void(0)
    }
}]));


upload.post('/addDemos', async(req, res) => {

        if (parseInt(req.fields.Priority)) {
            req.fields.Priority = parseInt(req.fields.Priority);

        } else {
            delete req.fields.Priority
        }
        if (req.fields.cover == '') {
            delete req.fields.cover

        }
        // console.log(req.fields)
    if (req.fields.password != "abcdefg") {
            return res.status(400).send({ message: "管理员密码错误" });
        }
        // 数据格式校验
        const { error } = validateDemos(req.fields);
        // 格式不符合要求
        if (error) return res.status(400).send({ message: error.message });
        // 格式符合要求 继续向下执行
        // 查询用户
        let demos = await Demos.findOne({ url: req.fields.url });
        // 用户已存在
        if (demos) return res.status(400).send({ message: '链接地址已经被使用' });
        // 如果用户上传了文件
        ////为了实时呈现上传的图片，使用Ajax处理，图片上传路由为upload,在前端表单设置input name=cover，val=ajax返回地址

        // 创建案例实例
        let demoobj = new Demos(req.fields);
        demoobj.save();
        return res.send(demoobj);
    })
    //垃圾图片清理函数
function clearImg() {
    Demos.find().select("cover -_id").then(result => {
        var Imgs = fs.readdirSync(path.join(__dirname, "../public/cover"));
        result = result.map((currentValue) => {
            // currentValue = currentValue.cover.split('/')[-1].split('\\')[-1];
            currentValue = currentValue.cover.split('/');
            currentValue = currentValue[currentValue.length - 1].split('\\');
            currentValue = currentValue[currentValue.length - 1];
            return currentValue;
        })


        Imgs.forEach((currentValue, index, arr) => {

            if (result.indexOf(currentValue) == -1) {
                fs.unlink(path.join(__dirname, "../public/cover", currentValue), (err) => {
                    if (err) {
                        console.log("\033[41;30m 异常错误 \033[0m", new Date().Format("yyyy-MM-dd hh:mm:ss"), '清理图片时遇到 ' + err);
                    }
                });
            }
        })
    }).catch(err => {
        console.log("\033[41;30m 异常错误 \033[0m", new Date().Format("yyyy-MM-dd hh:mm:ss"), '清理图片时遇到 ' + err);
    });

}
upload.post('/getDemos', async(req, res) => {
        var data = await Demos.find();
        res.send({ message: data })
    })
    //计数器
var loadNum = 0;
upload.use('/upload', (req, res) => {
    if (req.files) {
        // 循环结果对象
        // console.log(path.join(req.files.cover.path.split('public')[1]))
        loadNum++;
        if (loadNum >= 10) {
            clearImg();
            loadNum = 0;
        }
        return res.send(path.join(req.files.cover.path.split('public')[1]));

    } else {
        return res.status(400).send({ message: '封面上传时遇到错误' })
    }
})

//导出路由对象
module.exports = upload;