let express = require('express');
let router = express.Router();
let path = require("path");
let mime = require('mime');

// 导入文件上传模块
let fs = require('fs');

var currDir = 'D:\\upload\\file.zip';
router.get('/', function (req, res, next) {
  var reqpath = decodeURI(req.path);
  console.log(reqpath);
  var filepath = path.join(currDir, reqpath);
  fs.lstat(filepath, function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end("404 Not Found");
        return;
      }
      res.writeHead(500);
      res.end(JSON.stringify(err));
      return;
    }
    if (stat.isDirectory()) {
      res.writeHead(403);
      res.end("403 Forbidden");
      return;
    }
    if (path.extname(filepath) !== '.zip') {
      res.writeHead(400);
      res.end("400 Bad Request");
      return;
    }
    var f = fs.createReadStream(filepath);
    const row = {};
    row['Content-Type'] = mime.getType(reqpath);
    row['Content-Disposition'] = 'attachment; filename=' + encodeURI(path.basename(reqpath));
    res.writeHead(200, row);
    f.pipe(res);
  });
});

module.exports = router;