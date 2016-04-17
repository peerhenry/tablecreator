/// <reference path="../typings/main.d.ts" />
"use strict";
var express = require("express");
var http = require("http");
var fs = require("fs");
var app = express();
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    var indexPage = fs.readFileSync("index.html");
    res.write(indexPage);
    res.end();
});
var port = 1234;
http.createServer(app).listen(port);
console.log("app listening on port: " + port);
