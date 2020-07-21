var express = require("express");
var router = express.Router();

// 统一返回格式
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: "",
    };

    next();
});

/**
 * @description: 注册
 * 校验 空 密码一致 是否注册过
 * **/

router.get("/user/register", function (req, res, next) {
    console.log(req.body);
    var userName = req.body.userName;
    var password = req.body.password;
    var rePassword = req.body.rePassword;

    if (userName === "") {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }
    if (password === "") {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }
    if (password !== rePassword) {
        responseData.code = 3;
        responseData.message = "两次输入密码不一致";
        res.json(responseData);
        return;
    }

    responseData.message = "注册成功";
    res.json(responseData);
});

module.exports = router;
