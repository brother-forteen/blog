/*
 * @Author: fourteen_brother
 * @Date: 2020-07-12 10:45:10
 * @Last Modified by: fourteen_brother
 * @Last Modified time: 2020-07-15 00:24:13
 */

var mongooes = require("mongoose");

// 用户的表结构
module.exports = new mongooes.Schema({
    // 用户名：
    userName: String,
    // 密码
    password: String,
});
