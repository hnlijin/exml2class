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
	var root = path.join(__dirname, "..", "resource", "ui");
	var classTemplete = fs.readFileSync(path.join(__dirname, "..", "exml2class", "eclass.ejs"), "utf8");
	var fileList = [];
	this.readDirSync(root, fileList);
	fileList.forEach(function(fn, index){
		this.parseFile(fn, classTemplete)
	}.bind(this));	
}

// var data = createEClassOptions();
// ejs.compile(classTemplete);
// var s = ejs.render(classTemplete, data);
// console.log(s);

EXml2Class.prototype.parseFile = function(fn, classTemplete)
{
	console.log("[Parse]:", fn);

	var data = this.createEClassOptions();
	var str = fs.readFileSync(fn, "utf8");
	parseString(str, function(error, result){
		var skin = result['e:Skin']
		this.parseSkin(skin, data)
	}.bind(this))
}

EXml2Class.prototype.parseSkin = function(skin, eclassData)
{
	eclassData.eclass.ename = skin.$.class
	for(var k in skin)
	{
		if (k != "$")
		{
			var item = skin[k]
			// if (item.$["id"] != null)
			// {
			// 	var itemData = {}
			// 	console.log(item)
			// 	eclassData.eclass.eids.push(itemData)
			// }	
			console.log(item)		
		}
	}

	console.log(eclassData, "\n\n")
}

EXml2Class.prototype.parseNode = function(node, eclassData)
{
	if (node.nodeType == 1)
	{
		console.log(node.tagName, node.getAttribute("id"));
	}

	var childNodes = node.childNodes;
	if (childNodes.length > 0)
	{
		for (i = 0; i < childNodes.length; i++)
		{
			var item = childNodes[i];
			if (item.nodeType == 1)
			{
				console.log(item.tagName, item.getAttribute("id"));
				// this.parseNode(item);
			}
			else
			{
				console.log(item.nodeType);
			}
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