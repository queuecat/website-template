module.exports = (req, res) => {
    // console.log("\033[41;30m 经过了404路由 \033[0m", new Date().Format("yyyy-MM-dd hh:mm:ss"), req.url);
    res.redirect('/404.html');
}