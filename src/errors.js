var util = require('util')

function AutoDNSError (code, message, object) {
	this.name = this.constructor.name

	this.code = code
	this.message = message
	this.object = object

	Error.captureStackTrace(this)
}
util.inherits(AutoDNSError, Error)

exports.AutoDNSError = AutoDNSError
