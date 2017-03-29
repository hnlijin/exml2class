var fs = require("fs");
var path = require("path");
var EXml2Class = require("./exml2class");

var exml2class = new EXml2Class();
var projectPath = path.join(__dirname);
var exmlPath = path.join("exml");
var outPath = path.join("ui");
exml2class.parse(projectPath, exmlPath, outPath);