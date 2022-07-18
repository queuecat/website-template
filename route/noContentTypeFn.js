const { model } = require("../demo/blog/model/task");

module.exports = (req, res, next) => {
    if (req.method == "GET"){
        req.headers["content-type"]="text/html";
        return next();
    }
        
    if (Boolean(req.headers["content-type"])) {
        return next();
    } else {
        return res.status(500).send({ message: "请求异常" });
    }

}