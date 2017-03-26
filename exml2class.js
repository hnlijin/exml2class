var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var DOMParser = require('xmldom').DOMParser;

function EXml2Class()
{
}

module.export = EXml2Class;

EXml2Class.prototype.constructor = function()
{

}

EXml2Class.prototype.parse = function()
{
	var root = path.join(__dirname, "..", "resource", "ui");
	var classTemplete = fs.readFileSync(path.join(__dirname, "..", "exml2class", "class.ejs"), "utf8");
	var fileList = [];
	this.readDirSync(root, fileList);
	fileList.forEach(function(fn, index){
		var data = this.createEClassOptions();
		var xmlStr = fs.readFileSync(fn, "utf8");
		var xml = new DOMParser().parseFromString(xmlStr, 'text/xml');
		this.parseEXml(xml, data);
	}.bind(this));
}

// var data = createEClassOptions();
// ejs.compile(classTemplete);
// var s = ejs.render(classTemplete, data);
// console.log(s);

EXml2Class.prototype.parseEXml = function(node, eclassData)
{
	console.log("kkk:", node.nodeName);
	if (node.hasChildNodes())
	{
		for(var item in node.childNodes)
		{
			// this.parseEXml(item);
		}
	}
}

EXml2Class.prototype.readDirSync = function(dir, fileList)
{
	var pa = fs.readdirSync(dir);
	pa.forEach(function(fn, index) {
		var fp = path.join(dir, fn);
		var finfo = fs.statSync(fp);
		if (finfo.isDirectory()) {
			readDirSync(fp, fileList);
		} else {
			var ext = path.extname(fp);
			if (ext == ".exml") {
				fileList.push(fp);
			}
		}
	});
}

EXml2Class.prototype.createEClassOptions = function()
{
	var data = {}
	data.eclass = {}; 
	data.eclass.enamespace = "eui."
	data.eclass.ename = "";
	data.eclass.eskin = "";
	data.eclass.eids = []; // {eid: "", eclass: ""}
	return data;
}