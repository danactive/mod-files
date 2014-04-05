/*global console, module*/
module.exports = [
	{
		"path": "package.json",
		"callback": function (content, options) {
			content.token.mapVersion = options.arg[0].substr(0, options.arg[0].lastIndexOf('.')); // Read all version element except last tag which is the build number

			return content;
		}
	},
	{
		"path": "web.config",
		"callback": function (content, options) {
			var index,
				value;
			content.configuration.appSettings[0].add.forEach(function (node, i) {
				if (node && node["$"] && node["$"].key === "BuildVersion") {
					index = i;
				}
			});

			content.configuration.appSettings[0].add[index]["$"].value = options.arg[0];

			return content;
		}
	},
	{
		"path": "../.gitignore",
		"callback": function (content, options) {
			var staticFolder = "Move.Map.Web\/Static/",
				pattern = new RegExp(staticFolder + "([0-9].[0-9]{1,2}.[0-9]{1,2})\/"),
				matches = pattern.exec(content),
				bad = staticFolder + matches[1] + "/",
				good = staticFolder + (options.arg[0].substr(0, options.arg[0].lastIndexOf('.'))) + "/";
			content = content.replace(bad, good);

			return content;
		}
	}
];