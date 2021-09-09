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
        var obj = JSON.parse(response.body);
        console.log('用户的openid：' + obj.openid);

        var mysql = require('mysql')
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'xxx',
            password: 'xxx',
            database: 'xxx'
        });
        
        var sql_create = 'INSERT INTO as_table (as_openid, as_level, as_scene, as_prop, as_money, as_date) VALUES (?, ?, ?, ?, ?, NOW())'
        var values_create = [String(obj.openid), 1, 1, 10, 0]
        
        var sql_search = 'SELECT * FROM as_table WHERE as_openid=?';
        var valuse_search = String(obj.openid)

        connection.connect()
        
        connection.query(sql_search, valuse_search, function (err, result_search, fields) {
            if (err) throw err
        
            console.log(new Date() + ' 正在检查用户 openid：' + obj.openid + '是否有信息存在数据库内...')
            if(!result_search[0]){
                console.log(new Date() + ' 查询不到～ 正在将一位新用户 openid：' + obj.openid + ' 的数据写入本地数据库！')
                connection.query(sql_create, values_create, function (err, result_create, fields) {
                if (err) throw err;
                
                console.log(new Date() + ' 新用户 openid：' + obj.openid + ' 的数据写入成功！')
                console.log(new Date() + ' 向小游戏返回用户 openid：' + obj.openid + ' 的本地数据！')
                connection.query(sql_search, valuse_search, function (err, result_search, fields) {
                    if (err) throw err
                        res.json(result_search[0])
                    })
                })
            }else{
                console.log(new Date() + ' 查询到了～ 正在获取用户 openid：' + obj.openid + ' 的本地数据！')
                console.log(new Date() + ' 向小游戏返回用户 openid：' + obj.openid + ' 的本地数据！')
                res.json(result_search[0])
            }
        })
    } catch (error) {
        console.log(error.response.body);
    }
})

app.post('/update', async(req, res) =>{
    console.log('小游戏发起的Method：' + req.method)
    console.log('小游戏发来的数据：（小游戏应该发来 as_tag、as_prop）' + req.body.as_tag)
    console.log('小游戏发来的数据：（小游戏应该发来 as_tag、as_prop）' + req.body.as_id)
    
    if(req.body.as_tag == 'update'){
        try {
            console.log('用户的as_id：' + req.body.as_id);
            var search_id = req.body.as_id
    
            var mysql = require('mysql')
            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'xxx',
                password: 'xxx',
                database: 'xxx'
            });
            
            var sql_update = 'UPDATE as_table SET as_prop = ? WHERE as_id = ?'
            var values_update = [, String(search_id)]
            
            var sql_search = 'SELECT * FROM as_table WHERE as_id=?';
            var valuse_search = String(search_id)
    
            connection.connect()
            
            connection.query(sql_search, valuse_search, function (err, result_search, fields) {
                if (err) throw err
            
                console.log(new Date() + ' 正在检查用户 as_id：' + search_id + '是否有信息存在数据库内...')
                if(!result_search[0]){
                    res.json({'err': '101'})
                    console.log(new Date() + ' 查询不到用户 as_id：' + search_id + ' 返回错误代码101')
                }else{
                    console.log(new Date() + ' 查询到用户 as_id：' + search_id + ' 的本地数据！')
                    console.log(new Date() + ' 查询到用户 as_id：' + search_id + ' 道具数量为：' + result_search[0].as_prop)
                    if(result_search[0].as_prop > 0){
                        console.log(new Date() + ' 用户 as_id：' + search_id + ' 道具数量减1')
                        connection.query(sql_update, [result_search[0].as_prop - 1, search_id], function (err, result_update, fields) {
                            if (err) throw err

                            connection.query(sql_search, valuse_search, function (err, result_search, fields) {
                                if (err) throw err

                                console.log(new Date() + ' 用户 as_id：' + search_id +  ' 更新后的道具数量：' + result_search[0].as_prop)
                                res.json({'as_prop': result_search[0].as_prop})
                                console.log(new Date() + ' 向小游戏返回用户 as_id：' + search_id + ' 的本地数据：' + {'as_prop': result_search[0].as_prop})
                                })
                            })
                    }else{
                        res.json({'as_prop': 0})
                        console.log(new Date() + ' 向小游戏返回用户 as_id：' + search_id + ' 的本地数据：' + {'as_prop': 0})
                    }
                }
            })
        } catch (error) {
            console.log(error.response.body);
        }
    }else{
        console.log('小游戏发来的数据有问题，本次请求的ip：' + req.ip)
        res.json({'err': '101'})
    }
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);