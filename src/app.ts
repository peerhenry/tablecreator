/// <reference path="../typings/main.d.ts" />

import * as express from "express";
import * as http from "http";
import * as fs from "fs";

var app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) =>{
    var indexPage: Buffer = fs.readFileSync("index.html");
    res.write(indexPage);
    res.end();
});

var port: number = 1234;
http.createServer(app).listen(port);
console.log("app listening on port: " + port);