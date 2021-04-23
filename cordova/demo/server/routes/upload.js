let express = require('express');
let router = express.Router();

// 导入文件上传模块
let fs = require('fs');
let multer = require('multer');

// 导入MySQL模块
// let mysql = require('mysql');
// let dbConfig = require('../db/config');
// let simpleSql = require('../db/simpleSql');
// 创建一个msql连接池
// let pool = mysql.createPool(dbConfig.mysql);

// let thmemName = 'default';
let uploadFolder = 'D:/upload';


// 创建文件夹
let createFolder = function (folder) {
  try {
    // 测试path指定的文件或目录的用户权限，我们用来检测文件是否存在
    // 如果文件路径不存在将会抛出错误'no such file or directory'
    fs.accessSync(folder);
  } catch (e) {
    // 文件夹不存在，以同步的方式创建目录
    fs.mkdirSync(folder);
  }
}


/* 使用硬盘存储模式设置存放接收到的文件的路径及文件名 */
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    createFolder(uploadFolder);
    uploadFolder = 'D:/upload/default';
    createFolder(uploadFolder);
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    // file: 
    // {
    //   fieldname: 'uploadedfile',
    //   originalname: 'Screenshot_2021-04-20-20-45-06-041_com.android.settings.jpg?1619162624959',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})


// 创建multer对象
let upload = multer({
  storage: storage
});

/* post upload listing. */
router.post('/', upload.single('uploadedfile'), function (req, res, next) {
  let file = req.file;
  console.log(file);
  res.json({
    res_name: file.filename,
  });

});


module.exports = router;