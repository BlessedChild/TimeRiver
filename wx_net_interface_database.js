var fs = require('fs');
var http = require('http');
var https = require('https');
var os = require("os");
var privateKey  = fs.readFileSync('./ssl.key', 'utf8');
var certificate = fs.readFileSync('./ssl.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const got = require('got');

const appid = 'xxx';
const secret = 'xxx';
var code = '';

app.post('/give_me_uid', async(req, res) =>{
    code = req.body.code
    var url1 = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
    console.log('小游戏发起的Method：' + req.method)
    console.log('小游戏发来的数据：（小游戏应该发来一个code）' + req.body.code)
    console.log('现在向微信服务器发起GET请求，发送的数据长这样：' + url1)
    
    try {
        const response = await got(url1);
        console.log(response.body);
        console.log('微信服务器返回的数据：' + response.body);
        console.log('现在向小游戏发送数据（这样不是很安全，仅仅做测试）：' + response.body);

        var mysql = require('mysql')
        var connection = mysql.createConnection({
          host: 'localhost',
          user: 'xxx',
          password: 'xxx',
          database: 'xxx'
        })
        
        connection.connect()
        
        var sql_test = 'SELECT * FROM as_table WHERE as_id=1';
        connection.query(sql_test, function (err, row, fields) {
            if (err) throw err
        
            console.log(new Date() + ' 正在数据库中查询数据...')
            console.log(row[0])
            res.json(row[0].RowDataPacket);
        })
        
        connection.end()
    } catch (error) {
        console.log(error.response.body);
    }
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);