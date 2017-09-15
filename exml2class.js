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

EXml2Class.prototype.parse = function(projectPath, exmlPath, outputPath)
{
	var exmlRoot = path.join(projectPath, exmlPath);
	var classTemplete = fs.readFileSync(path.join(__dirname, "eclass.ejs"), "utf8");
	var fileList = [];
	this.readDirSync(exmlRoot, fileList);
	fileList.forEach(function(fn, index){
		this.parseFile(fn, classTemplete, projectPath, exmlPath, outputPath)
	}.bind(this));	
}

EXml2Class.prototype.parseFile = function(fn, classTemplete, projectPath, exmlPath, outputPath)
{
	console.log("[Parse]:", fn);

	var data = this.createEClassOptions();
	var str = fs.readFileSync(fn, "utf8");
	parseString(str, function(error, result)
	{
		data.eclass.eskin = path.relative(projectPath, fn);

		var skin = result['e:Skin'];
		this.parseSkin(skin, data);

		ejs.compile(classTemplete);
		var s = ejs.render(classTemplete, data);

		var p1 = path.join(projectPath, exmlPath)
		var p2 = path.relative(p1, fn)
		var ep = path.dirname(p2);
		var op = path.join(projectPath, outputPath, ep); //TS文件夹路径

		if (fs.existsSync(op) == false) {
			fs.mkdirSync(op);
		}
		var ofp = path.join(op, data.eclass.ename + ".ts") //TS文件
		fs.writeFile(ofp, s, (err) => {
			if (err) {
				console.log("[ERROR]:", err);
			} else {
				console.log("[SUCC]:", fn);
				console.log("[OUTPUT]:", ofp);
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
			eclassData.eclass.ename = skin.$.class.replace("Skin", eclassData.eclass.suffix);
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
			
			if (typeof(item) == "string") {
				break;
			}

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
			this.readDirSync(fp, fileList);
		} else {
			var ext = path.extname(fp);
			if (ext == ".exml") {
				fileList.push(fp);
			}
		}
	}.bind(this));
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