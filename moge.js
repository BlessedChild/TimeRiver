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

app.post('/moge', function (req, res) {
    console.log(req.method)
    console.log(req.body)
    res.send({"__filename": __filename})
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);