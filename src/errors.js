var util = require('util')

function GatewayError (code, message, object) {
	this.name = this.constructor.name

	this.code = code
	this.message = message
	this.object = object

	Error.captureStackTrace(this)
}
util.inherits(GatewayError, Error)

GatewayError.prototype.toString = function () {
	return 'AutoDNS gateway error #' + this.code + ': ' + this.message
}

exports.GatewayError = GatewayError
