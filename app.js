/**
 * @description: 应用程序的启动文件
 * **/

// 加载express模块
const express = require("express");

// 加载模板处理模块
const swig = require("swig");

// 加载数据库模块
const mongoose = require("mongoose");

// body-parser 用来解析前端post提交过来的数据
const bodyParser = require("body-parser");

// 加载Cookies模块
const Cookies = require('cookies')

// 跨域
const cors = require("cors");

// 创建app应用
const app = express();

app.use(cors());

// 设置静态文件托管
// 当用户访问的url以/public开始的时候，直接返回对应的__dirname + '/public下的文件
app.use("/public", express.static(__dirname + "/public"));

/**
 * @description: 配置应用模板 - 定义当前应用所使用的模板引擎
 * @param: params1: 模板引擎的名称，同时也是模板文件的后缀
 * @param: params2: 用于解析处理模板内容的方法
 * **/  

app.engine("html", swig.renderFile);

// 设置模板文件存放的目录
// params1 必须是views
// params2 目录
app.set("views", "./views");

// 注册模板所使用的引擎
// 第一个参数必须是view engine
// 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set("view engine", "html");

// // body-parser 设置
app.use(bodyParser.json()); // json请求
app.use(bodyParser.urlencoded({ extended: true })); // 表单请求

// 设置cookie
app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);

    // 解析登录用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get("userInfo")) {
        try {
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
        } catch (e) {}
    }

    next();
});

// 取消模板缓存
swig.setDefaults({
    cache: false,
});

/**
 * @description： 分模块管理,根据不同的功能划分不同的模块
 * **/ 
app.use("/", require("./routers/main"));
app.use("/api", require("./routers/api"));
app.use("/admin", require("./routers/admin"));
app.use("/category", require("./routers/category"));

// 监听http请求
mongoose.connect("mongodb://localhost:27018/blog", { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接失败'));

db.once('open', function (err) {
    if (err) {
        console.log("数据库连接失败");
    } else {
        console.log("数据库连接成功");
        app.listen(9090);
    }
});

// 用户发出http请求 -》 url -》 解析路由 -》 找到匹配规则 -》 执行指定的函数，返回对应的内容至用户
