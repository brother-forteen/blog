let express = require('express');
const { exists } = require('../models/category');
let router = express.Router();
let Category = require('../models/category');
const category = require('../schemas/category');

let responseData = {
    code: 0,
    message: ''
};

// 添加
router.post('/add', (req, res, next) =>{
    let name = req.body.name || '';
    if(name){

        Category.findOne({name: name}).then(category => {
            if(category){
                responseData.code = 21;
                responseData.message = '分类已存在';

                return res.json(responseData);
            }

            return new Category({
                name: name
            }).save();
        }).then(newCategory => {
            responseData.code = 0;
            responseData.message = '添加成功';
            responseData.data = {
                // id: '',
                name: name
            }

            return res.json(responseData);
        })
    }else{
        responseData.code = 400;
        responseData.message = '名称不能为空';

        return res.json(responseData);
    }
});

// 删除
router.delete('/delete', (req, res, next) => {
    let id = req.query.id;

    Category.remove({
        _id: id
    }).then(response =>{
        if(response){
            responseData.code = 0;
            responseData.data = null,
            responseData.message = '删除成功';
        }else{
            responseData.code = 1;
            responseData.data = null,
            responseData.message = '删除失败';
        }

        return res.json(responseData);
    })
});

// 修改
router.put('/edit', (req, res, next) => {
    let id = req.body.id || '';
    let name = req.body.name || '';

    // 获取要修改的分类的信息
    Category.findOne({
        _id: id
    }).then(category => {
        if(!category){
            responseData.code = 1;
            responseData.message = '该分类不存在';

            return Promise.reject();
        }else{
            // 要修改的分类名称是否在数据库中已经存在
            return Category.findOne({
                name: name,
            })
        }
    }).then(existsCategory => {
        if(existsCategory){
            responseData.code = 1;
            responseData.message = '该分类已存在';

            return Promise.reject();
        }else {
            return Category.updateOne({
                _id: id
            }, {
                name: name
            })
        }
    }).then(response => {
        responseData.code = 0;
        responseData.message = '修改成功';

        return res.json(responseData);
    });
});

// 查
router.get('/list', (req, res, next) => {
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    let skip = pageSize * (pageNo - 1);

    console.log(pageNo)
    console.log(pageSize)

    Category.countDocuments().then(count => {
        let totalCount = count;
        let totalPage = Math.ceil(totalCount / pageSize);

        Category.find().sort({_id: -1}).limit(pageSize).skip(skip).then(list => {
            responseData.code = 0;
            responseData.message = "请求成功";
            responseData.data = {
                pageSize: pageSize,
                pageNo: pageNo,
                totalCount: totalCount,
                totalPage: totalPage,
                data: list
            }
            
            return res.json(responseData);
        })
    })
});

// 查详情
router.get('/detail', (req, res, next) => {
    let id = req.query.id;

    Category.findOne({
        id: id
    }).then(category => {
        if(!category){
            responseData.code = 1;
            responseData.message = '该分类不存在';
        }else{
            responseData.code = 0;
            responseData.message = '请求成功';
            responseData.data = category;
        }

        return res.json(responseData);
    })
});

module.exports = router;