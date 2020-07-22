/**
 * @description: 应用程序的启动文件
 * **/

// 加载express模块
const express = require("express");

// 加载模板处理模块
const swig = require("swig");
const { Mongoose } = require("mongoose");

// 加载数据库模块
const mongoose = require("mongoose");

// body-parser 用来解析前端post提交过来的数据
const bodyParser = require("body-parser");

// 跨域
const cors = require("cors");

// 创建app应用
const app = express();

app.use(cors());

//设置跨域访问
// app.all("*", function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With"
//     );
//     res.header(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("X-Powered-By", " 3.2.1");
//     res.header("Content-Type", "application/json;charset=utf-8");
//     if (req.method === "OPTIONS") {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });

// 设置静态文件托管
// 当用户访问的url以/public开始的时候，直接返回对应的__dirname + '/public下的文件
app.use("/public", express.static(__dirname + "/public"));

// 配置应用模板
// 定义当前应用所使用的模板引擎
// params1: 模板引擎的名称，同时也是模板文件的后缀
// params2: 用于解析处理模板内容的方法
app.engine("html", swig.renderFile);

// 设置模板文件存放的目录
// params1 必须是views
// params2 目录
app.set("views", "./views");

// 注册模板所使用的引擎
// 第一个参数必须是view engine
// 第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set("view engine", "html");

// body-parser 设置
app.use(bodyParser.json()); // json请求
app.use(bodyParser.urlencoded({ extended: true })); // 表单请求

// 取消模板缓存
swig.setDefaults({
    cache: false,
});
// /**
//  * 首页
//  * req request 对象
//  * res response 对象
//  * next 函数
//  * **/
// app.get("/", function (req, res, next) {
//   //   res.send("<h1>欢迎光临我的博客！</h1>");

//   // 读取views目录下的指定文件，解析并返回给客户端
//   // params1 模板的文件，相对于views目录， views/index.html
//   // params2 传递给模板使用的数据
//   res.render("index");
// });

// 分模块管理,根据不同的功能划分不同的模块
app.use("/", require("./routers/main"));
app.use("/api", require("./routers/api"));
app.use("/admin", require("./routers/admin"));

// 监听http请求
mongoose.connect("mongodb://localhost:27018/blog", function (err) {
    if (err) {
        console.log("数据库连接失败");
    } else {
        console.log("数据库连接成功");
        app.listen(8081);
    }
});

// 用户发出http请求 -》 url -》 解析路由 -》 找到匹配规则 -》 执行指定的函数，返回对应的内容至用户
