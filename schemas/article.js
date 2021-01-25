let mongoose = require('mongoose');
let Category = require('../models/category');

module.exports = new mongoose.Schema({
    title: String,         // 标题
    author: String,        // 作者
    categoryId: {          // 所属类别、
        type: mongoose.Schema.Types.ObjectId,
        ref: Category
    },    
    isBoutique: {          // 是否精品文章
        type: Boolean,
        default: false
    },  
    content: String,       // 内容
    createTime: String,
    status: 0,             // 0草稿  1发布
})