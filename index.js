var fs = require("fs");
var path = require("path");
var EXml2Class = require("./exml2class");

var exml2class = new EXml2Class();
var arguments = process.argv.splice(2)
if (arguments.length == 3) {
	exml2class.parse(arguments[0], arguments[1], arguments[2]);
} else {
	console.log("");
	console.log("args: [egret项目路径], [exml文件相对项目路径], [class文件相对项目输出路径]");
	console.log("");
}