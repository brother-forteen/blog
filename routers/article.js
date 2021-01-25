let express = require('express');
let router = express.Router();
let Article = require('../models/article');
const article = require('../schemas/article');

let responseData = {
    code: 0,
    message: ''
};

// 添加文章
router.post('/add', (req, res, next) => {
    let data = req.body;

    if(!data.title){
        responseData.code = 1;
        responseData.message = '标题不能为空';
        return res.json(responseData);
    }

    if(!data.author){
        responseData.code = 1;
        responseData.message = '作者不能为空';
        return res.json(responseData);
    }

    if(!data.author){
        responseData.code = 1;
        responseData.message = '作者不能为空';
        return res.json(responseData);
    }

    if(!data.categoryId){
        responseData.code = 1;
        responseData.message = '所属类别不能为空';
        return res.json(responseData);
    }

    if(!data.content){
        responseData.code = 1;
        responseData.message = '内容不能为空';
        return res.json(responseData);
    }

    new Article({
        title: data.title,              // 标题
        author: data.author,            // 作者
        categoryId: data.categoryId,    // 所属类别、
        isBoutique: data.isBoutique || false,  
        content: data.content,       // 内容
        createTime: new Date(),
        status: data.status
    });

    responseData.code = 0;
    responseData.message = '添加成功';
    return res.json(responseData);
});

// 删除文章
router.delete('/delete', (req, res, next) => {
    let id = req.body.id;

    Article.findOne({
        _id: id
    }).then(article => {
        if(article){
            return Article.remove({
                _id: id
            })
        }else{
            responseData.code = 1;
            responseData.message = '此文章不存在';
            res.data = null;
            return res.json(responseData);
        }
    }).then(response => {
        if(response){
            response.code = 0;
            response.message = '删除成功';
            response.data = null;
        }else{
            response.code = 1;
            response.message = '删除失败';
            response.data = null;
        }

        return res.json(responseData);
    })
});

// 修改文章
router.put('/edit', (req, resm, next) => {
    let id = req.body.id;
    let data = res.body;

    Article.findOne({
        _id: id
    }).then(article => {
        if(!article){
            responseData.code = 1;
            responseData.message = '该文章不存在';
            responseData.data = null;

            return res.json(responseData);
        }else {
            let obj = {};
            let params = ['title', 'author', 'categoryId', 'isBoutique', 'content', 'status'];

            for(let val of params){
                if(data[val]){
                    obj[val] = data[val];
                }
            }
          
            return Article.updateOne({ _id: id}, obj);
        }
    }).then(response => {
        if(response){
            responseData.code = 0;
            responseData.message = '修改成功';
            responseData.data = null;
        }else{
            responseData.code = 1;
            responseData.message = '修改失败';
            responseData.data = null;
        }

        return res.json(responseData);
    })
});

// 查文章列表
router.get('/list', (req, res, next) => {
    let pageNo = res.body.pageNo || 1;
    let pageSize = res.body.pageSize ? parseInt(res.body.pageSize) : 10;
    let skip = pageSize * (pageNo - 1);

    Article.countDocuments().then(count => {
        let totalCount = count;
        let totalPage = Math.ceil(totalCount / pageSize);

        Article.find().sort({_id: -1}).populate('category').limit(apgeSize).skip(skip).then(list => {
            if(list){
                responseData.message = '请求成功';
                responseData.code = 0;
                responseData.data = {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    totalCount: totalCount,
                    totalPage: totalPage,
                    data: list
                }
            }else{
                responseData.code = 1;
                responseData.message = '请求失败';
                responseData.data = null;
            }
       

            return res.json(responseData);
        })
    })
})

// 查文章详情
router.get('/detail', (req, res, next) => {
    Article.find({
        _id: req.body.id
    }).populate('category').then(detail => {
        if(detail){
            responseData.code = 0;
            responseData.message = '请求成功';
            responseData.data = detail;
        }else{
            responseData.code = 1;
            responseData.message = '请求失败';
            responseData.data = null;
        }

        return res.json(responseData);
    })
})

module.exports = router;
