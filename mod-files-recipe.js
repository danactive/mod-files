/*global console, module*/
module.exports = [
	{
		"path": "package.json",
		"callback": function (content, options) {
			content.version = options.arg[0];
			return content;
		}
	}
];