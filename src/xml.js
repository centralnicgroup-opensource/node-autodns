var xml2js = require('xml2js')

function XML (builderOpts, parserOpts) {
	this.builder = new xml2js.Builder(builderOpts)
	this.parser = new xml2js.Parser(parserOpts)

	this.ZoneCreate.build = this.ZoneCreate.build.bind(this)
}

// Wraps request data in auth data and returns XML

XML.prototype.build = function (options, request) {
	var auth = {}
	// TODO: throw when user/password not defined?
	if (options.user) auth.user = options.user
	if (options.password) auth.password = options.password
	if (options.context) auth.context = options.context

	request = request || {}
	request.auth = auth

	return this.builder.buildObject({ request: request })
}

XML.prototype.ZoneCreate = {
	build: function (options, data) {
		var zone = {}
		// TODO: throw when name is not defined?
		zone.name = data.name
		zone.ns_action = data.ns_action || 'complete'

		// TODO: figure out zone.main

		return this.build(options, {
			task: {
				code: '0201',
				zone: zone
			}
		})
	}
}

module.exports = XML
