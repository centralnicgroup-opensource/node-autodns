var xml2js = require('xml2js')

function XML (builderOpts, parserOpts) {
	this.builder = new xml2js.Builder(builderOpts)
	this.parser = new xml2js.Parser(parserOpts)
}

XML.prototype.build = function (options, data) {
	var auth = {}
	if (options.user) auth.user = options.user
	if (options.password) auth.password = options.password
	if (options.context) auth.context = options.context

	var req = {
		request: {
			auth: auth
		}
	}

	return this.builder.buildObject(req)
}


module.exports = XML
