var fs = require("fs");
var path = require("path");
var ejs = require("ejs")

var root = path.join(__dirname, "..", "resource", "ui");
var temp = fs.readFileSync(path.join(__dirname, "..", "exml2class", "class.ejs"), "utf-8");
var fileList = []
readDirSync(root, fileList)
console.log(temp)

var data = {}
data.class = {}
data.class.name = "MainUI"
// var template = ejs.compile(temp)
// template(data)
var s = ejs.render(temp, data)
console.log(s)

function readDirSync(dir, fileList)
{
	var pa = fs.readdirSync(dir);
	pa.forEach(function(fn, index) {
		console.log(fn, index)
		var fp = path.join(dir, fn)
		var finfo = fs.statSync(fp)
		if (finfo.isDirectory()) {
			readDirSync(fp, fileList)
		} else {
			var ext = path.extname(fp)
			if (ext == ".exml") {
				fileList.push(fileList, fp)
			}
		}
	});
}

fileList.forEach(function(fn, index){
	console.log(fn, index)
});