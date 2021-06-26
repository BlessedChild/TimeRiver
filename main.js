var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./ssl.key', 'utf8');
var certificate = fs.readFileSync('./ssl.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/inti', function (req, res) {
    console.log(req.method)
    console.log(req.headers)
})

var user_aera = []
var package_area = []

function handleRequset(request, db_user, db_package){
    if(db_user.length > 0){
        for (var i=0; i<db_user.length; i++)
        {
            if(db_user[i] === request.userid){
                console.log("Found, so update the date which be found to request's date...")
                console.log("old package: ")
                console.log(db_package[i])
                db_package[i] = request
                console.log("new package: ")
                console.log(db_package[i])
                return
            }
        }
        console.log("not found, so add request's date...")
        console.log("old package: ")
        console.log(db_package)
        db_package[db_user.length] = request
        console.log("new package: ")
        console.log(db_package)
    }else if(db_user.length == 0){
        console.log("Received the first request...")
        db_user[0] = request.userid
        db_package[0] = request
        console.log("new package: ")
        console.log(db_package)
    }
}

var hp = 100;
var mp = 100;
var ex = 0;

app.post('/inti', function (req, res) {
    console.log(req.method)
    console.log(req.body)
    if(req.body.tag == "login"){
        var userid = Date.now()
        var loginDate = {'userid': userid, 'res': 'ArthurSlog', 'country': 'Shenzhen', 'userId': 'building', 'video': 'https://space.bilibili.com/57386850', 'wechart': 'xiaowang_dalai', 'tag': userid, 'hp': hp, 'mp': mp, 'ex': ex}
        handleRequset(loginDate, user_aera, package_area)
        res.send(loginDate)
        console.log(userid)
    }else if(req.body.tag == "reconnect"){
        var reconnectDate = {'userid': req.body.userid, 'res': 'ArthurSlog', 'country': 'Shenzhen', 'userId': 'building', 'video': 'https://space.bilibili.com/57386850', 'wechart': 'xiaowang_dalai', 'tag': req.body.userid, 'hp': hp, 'mp': mp, 'ex': ex}
        handleRequset(reconnectDate, user_aera, package_area)
        res.send(package_area)
    }    
    else{
        var synchronizedData = {'userid': req.body.userid, 'tag': req.body.userid, 'x': req.body.x, 'y': req.body.y, 'message': req.body.message, "scene": req.body.scene, 'hp': hp, 'mp': mp, 'ex': ex, 'res': 'ArthurSlog', 'country': 'Shenzhen', 'userId': 'building', 'video': 'https://space.bilibili.com/57386850', 'wechart': 'xiaowang_dalai'}
        handleRequset(synchronizedData, user_aera, package_area)
        res.send(package_area)
        console.log("Respon client: ")
        console.log(package_area)
    }
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
