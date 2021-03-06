/*global console, process, require*/
var fs = require('fs'),
	options = {
		arg: []
	};

function processJson(recipeFile, fileType) {
	fs.readFile(recipeFile.path, function (errRead, rawJson) {
		if (errRead) {
			throw errRead;
		}
		var parsedJson = JSON.parse(rawJson);
		options.fileType = fileType;
		if (recipeFile.callback) {
			parsedJson = recipeFile.callback.call(recipeFile, parsedJson, options);
		}
		fs.writeFile(recipeFile.path, JSON.stringify(parsedJson, null, "\t"), function (errWrite) {
			if (errWrite) {
				throw errWrite;
			}
			console.log("JSON saved to " + recipeFile.path);
		});
	});
}
function processXml(recipeFile, fileType) {
	var parser,
		xmlModule = require('xml2js');
	parser = new xmlModule.Parser();
	fs.readFile(recipeFile.path, function (errRead, rawXml) {
		if (errRead) {
			throw errRead;
		}
		parser.parseString(rawXml, function (errParse, parsedXml) {
			if (errParse) {
				throw errParse;
			}
			var xml;
			options.fileType = fileType;
			if (recipeFile.callback) {
				parsedXml = recipeFile.callback.call(recipeFile, parsedXml, options);
			}
			
			xml = new xmlModule.Builder().buildObject(parsedXml);
			fs.writeFile(recipeFile.path, xml, function (errWrite) {
				if (errWrite) {
					throw errWrite;
				}
				console.log("XML saved to " + recipeFile.path);
			});
		});
	});
}
function processText(recipeFile, fileType) {
	fs.readFile(recipeFile.path, function (errRead, rawText) {
		if (errRead) {
			throw errRead;
		}
		var parsedText = rawText.toString();
		options.fileType = fileType;
		if (recipeFile.callback) {
			parsedText = recipeFile.callback.call(recipeFile, parsedText, options);
		}
		fs.writeFile(recipeFile.path, parsedText, function (errWrite) {
			if (errWrite) {
				throw errWrite;
			}
			console.log("Text file saved to " + recipeFile.path);
		});
	});
}

function writeToFiles() {
	var fileType,
		recipes = require('./../../mod-files-recipe.js');

	recipes.forEach(function (recipe) {
		if (recipe.path) {
			fileType = recipe.path.substring(recipe.path.lastIndexOf(".")+1);
			switch (fileType) {
				case "json":
					processJson(recipe, fileType);
					break;
				case "config":
				case "xml":
					processXml(recipe, fileType);
					break;
				default:
					processText(recipe, fileType);
					break;
			}
		}
	});
}

function getArgs() {
	// Read incoming arguments from command prompt/power shell
	process.argv.forEach(function (value, index, array) {
		/*
			index 0 is (built-in) "node"
			index 1 is (built-in) the name of the JavaScript file
			index 2 is custom
		*/
		if (index >= 2) {
			options.arg[index - 2] = value;
		}
	});
}

getArgs();
writeToFiles();