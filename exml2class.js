var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var DOMParser = require('xmldom').DOMParser;
var parseString = require('xml2js').parseString;

function EXml2Class()
{
}

module.export = EXml2Class;

EXml2Class.prototype.constructor = function()
{

}

EXml2Class.prototype.parse = function()
{
	// var root = path.join(__dirname, "..", "resource", "ui");
	// var classTemplete = fs.readFileSync(path.join(__dirname, "..", "exml2class", "eclass.ejs"), "utf8");
	var root = path.join(__dirname, "exml");
	var classTemplete = fs.readFileSync(path.join(__dirname, "eclass.ejs"), "utf8");
	var fileList = [];
	this.readDirSync(root, fileList);
	fileList.forEach(function(fn, index){
		this.parseFile(fn, classTemplete)
	}.bind(this));	
}

EXml2Class.prototype.parseFile = function(fn, classTemplete)
{
	console.log("[Parse]:", fn);

	var data = this.createEClassOptions();
	var str = fs.readFileSync(fn, "utf8");
	parseString(str, function(error, result){
		var skin = result['e:Skin']
		this.parseSkin(skin, data)
		ejs.compile(classTemplete);
		var s = ejs.render(classTemplete, data);
		console.log(s);
	}.bind(this))
}

EXml2Class.prototype.parseSkin = function(skin, eclassData)
{
	console.log(skin)

	for(var k in skin)
	{
		if (k == "$")
		{
			eclassData.eclass.ename = skin.$.class
		}
		else
		{
			var item = skin[k]
			this.parseNode(k, item, eclassData)	
		}
	}
}

EXml2Class.prototype.parseNode = function(eclass, node, eclassData)
{
	console.log("kkk:", eclass)

	for(var k in node)
	{
		if (k == "$")
		{
			if (node.$.id != undefined)
			{
				console.log(node)
				var itemData = {}
				itemData.eid = node.$.id
				itemData.eclass = eclass
				eclassData.eclass.eids.push(itemData)
			}
		}
		else
		{
			var item = node[k]
			this.parseNode(k, item, eclassData)
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

var exml2class = new EXml2Class();
exml2class.parse();