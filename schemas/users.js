/*
 * @Author: fourteen_brother
 * @Date: 2020-07-12 10:45:10
 * @Last Modified by: fourteen_brother
 * @Last Modified time: 2021-01-09 17:47:45
 */

var mongoose = require("mongoose");

// 用户的表结构
module.exports = new mongoose.Schema({
    // 用户名：
    userName: String,

    // 密码
    password: String,

    // 角色
    role: {
        type: String,
        default: "visitor",
    }, // Admin-管理员
});
