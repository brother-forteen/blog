/*
 * @Author: fourteen_brother
 * @Date: 2020-07-15 00:01:21
 * @Last Modified by: fourteen_brother
 * @Last Modified time: 2020-09-01 22:52:36
 */

var mongoose = require("mongoose");
var usersSchema = require("../schemas/users");

module.exports = mongoose.model("User", usersSchema);
