// 数据库操作
const mongoose = require('mongoose');
// 模型规则类
const { Schema } = mongoose;
// 对象规则验证
const Joi = require('joi');
// 文章模型规则
const DemosSchema = new Schema({
    title: {
        type: String,
        minlength: 1,
        required: [true, '请输入标题']
    },
    // 内容介绍
    content: {
        type: String,
        minlength: 1,
        required: [true, '请输入介绍内容']
    },
    // 链接
    url: {
        type: String,
        required: [true, '请输入链接地址'],
        unique: true

    },
    // 优先级
    Priority: {
        type: Number,
        // 0 未批准 1 批准
        default: 5
    },
    // 时间
    createAt: {
        type: Date,
        default: Date.now
    },
    //封面
    cover: {
        type: String,
        default: "/cover/" + Math.ceil(Math.random() * 10) + ".jpeg"
    }
}, { versionKey: false });
// 创建分类集合
const Demos = mongoose.model('demos', DemosSchema);
// Comment.create({
//         author: '5e9efe297430265848c1d46a',
//         content: '666',
//         post: '5ea2da2901bddc4c6c75f081',
//     })
// 文章分类格式校验（路由级别）
const validateDemos = Demos => {
    // 定义对象验证规则
    const schema = {
        title: Joi.string().required().error(new Error('标题不符合规则')),
        content: Joi.string().required().error(new Error('内容不符合规则')),
        url: Joi.string().required().error(new Error('链接地址非法')),
        Priority: Joi.number().valid(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10).error(new Error('优先级不符合规则')),
        cover: Joi.string().error(new Error('封面不符合规则'))
    };
    // 验证
    return Joi.validate(Demos, schema, {
        // 检测到所有错误
        abortEarly: false,
        // 允许对象包含被忽略的未知键
        allowUnknown: true
    });

}

// 导出模块成员
module.exports = {
    Demos, //数据库操作对象
    validateDemos //对其传递一个对象用于验证，返回promise对象
}