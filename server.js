var http = require('http');
var fs = require('fs');
var url = require('url');
var qiniu = require('qiniu');
var port = process.argv[2];

if (!port) {
  console.log('请指定端口号好不啦？\n node server.js 8888 这样不会吗？');
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var path = request.url;
  var query = '';
  if (path.indexOf('?') >= 0) {
    query = path.substring(path.indexOf('?'));
  }
  var pathNoQuery = parsedUrl.pathname;
  var queryObject = parsedUrl.query;
  var method = request.method;

  console.log('HTTP 路径为\n' + path);

  if (path == '/uptoken') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/json;charset=utf-8');
    response.setHeader('Access-Control-Allow-Origin', '*');
    var config = fs.readFileSync('./qiniu-config.json');
    let {
      accessKey,
      secretKey
    } = JSON.parse(config);
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: '163-music-demo',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    response.write(`
    {
      "uptoken": "${uploadToken}"
    }`);
    response.end();
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/json;charset=utf-8');
    response.write('服务器运行失败');
    response.end();
  }
});

server.listen(port);
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port);