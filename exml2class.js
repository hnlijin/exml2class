var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var parseString = require('xml2js').parseString;

function EXml2Class()
{
}

module.exports = EXml2Class;

EXml2Class.prototype.constructor = function()
{

}

EXml2Class.prototype.parse = function(projectPath, exmlPath, outPath)
{
	var exmlRoot = path.join(projectPath, exmlPath);
	var classTemplete = fs.readFileSync(path.join(__dirname, "eclass.ejs"), "utf8");
	var fileList = [];
	this.readDirSync(exmlRoot, fileList);
	var classOutPath = path.join(projectPath, outPath);
	if (fs.existsSync(classOutPath) == false) {
		fs.mkdirSync(classOutPath)
	}
	fileList.forEach(function(fn, index){
		this.parseFile(fn, classTemplete, exmlPath, classOutPath)
	}.bind(this));	
}

EXml2Class.prototype.parseFile = function(fn, classTemplete, exmlPath, classOutPath)
{
	console.log("[Parse]:", fn);

	var data = this.createEClassOptions();
	data.eclass.eskin = path.join(exmlPath, path.basename(fn));
	var str = fs.readFileSync(fn, "utf8");
	parseString(str, function(error, result){
		var skin = result['e:Skin'];
		this.parseSkin(skin, data);
		ejs.compile(classTemplete);
		var s = ejs.render(classTemplete, data);
		var op = path.join(classOutPath, data.eclass.ename + data.eclass.suffix + ".ts")
		fs.writeFile(op, s, (err) => {
			if (err) {
				console.log("[ERROR]:", err);
			} else {
				console.log("[SUCC]:", fn);
				console.log("[OUTPUT]:", op);
			}
		});
	}.bind(this))
}

EXml2Class.prototype.parseSkin = function(skin, eclassData)
{
	for(var k in skin)
	{
		if (k == "$")
		{
			eclassData.eclass.ename = skin.$.class;
		}
		else
		{
			var item = skin[k];
			this.parseNode(k, item, eclassData);
		}
	}
}

EXml2Class.prototype.parseNode = function(eclass, node, eclassData)
{
	for(var k in node)
	{
		if (k == "$")
		{
			if (node.$.id != undefined)
			{
				var itemData = {};
				itemData.eid = node.$.id;
				var arr = eclass.split(":")
				if (arr.length == 2) {
					itemData.eclass = eclassData.replaceDict[arr[0]] + arr[1];
				} else {
					itemData.eclass = eclass
				}
				eclassData.eclass.eids.push(itemData);
			}
		}
		else
		{
			var item = node[k];
			if (node.length != undefined) {
				this.parseNode(eclass, item, eclassData);
			} else {
				this.parseNode(k, item, eclassData);
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

// euid: [{eid: "", eclass: ""}]
EXml2Class.prototype.createEClassOptions = function()
{
	var data = {}
	data.eclass = {}; 
	data.eclass.enamespace = "eui."
	data.eclass.ename = "";
	data.eclass.eskin = "";
	data.eclass.eids = [];
	data.eclass.suffix = "UI";
	data.replaceDict = {}
	data.replaceDict["e"] = "eui.";
	data.replaceDict["w"] = "";
	return data;
}