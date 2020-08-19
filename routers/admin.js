var express = require("express");
var router = express.Router();
var querystring = require("querystring");
var User = require("../models/user");
const { userInfo } = require("os");

// 统一返回格式
var responseData;
router.use((req, res, next) => {
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

router.post("/user/register", (req, res, next) => {
    // console.log(req);
    // console.log(res);
    // console.log(req.body.userName);
    let userName = req.body.userName;
    let password = req.body.password;

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

    // 验证用户名是否已经被注册，如果数据库中已经存在和我们要注册的用户同名的数据，标识该用户已经被注册了
    User.findOne({
        userName: userName,
    })
        .then((userInfo) => {
            // console.log(userInfo);
            if (userInfo) {
                // 表示数据库中有该记录
                responseData.code = 4;
                responseData.message = "用户名已被占用";
                res.json(responseData);
                return;
            }
            // 保存用户的信息到数据库中
            let user = new User({
                userName: userName,
                password: password,
            });

            return user.save();
        })
        .then((addUserInfo) => {
            // console.log(addUserInfo);
            responseData.message = "注册成功";
            res.json(responseData);
        });

    // let postData = "";
    // // 数据块接收中
    // req.addListener("data", (postDataChunk) => {
    //     postData += postDataChunk;
    // });
    // // 数据接收完毕，执行回调函数
    // req.addListener("end", () => {
    //     console.log(postData);
    //     console.log(postData["userName"]);
    //     // var params = querystring.parse(postData);
    //     // console.log(params);
    // });
});

/**
 * @description: 登录
 * **/
router.post("/user/login", (req, res, next) => {
    console.log(req.body);
    let userName = req.body.userName;
    let password = req.body.password;

    if (userName === "" || password === "") {
        responseData.code = 1;
        responseData.message = "用户名或密码不能为空";
        res.json(responseData);
        return;
    }

    // 查询当前用户是否被注册过
    User.findOne({
        userName: userName,
    }).then((userInfo) => {
        if (!userInfo) {
            responseData.code = 3;
            responseData.message = "用户未被注册，请先注册";
            res.json(responseData);
            return;
        }

        // 查询数据库中是否有相匹配的用户名和密码
        User.findOne({
            userName: userName,
            password: password,
        }).then((userInfo) => {
            if (!userInfo) {
                responseData.code = 2;
                responseData.message = "用户名或密码错误";
                res.json(responseData);
                return;
            }

            responseData.message = "登录成功";
            responseData.data = {
                id: userInfo._id,
                userName: userInfo.userName,
                password: userInfo.password,
            };
            res.json(responseData);
            return;
        });
    });
});

module.exports = router;
