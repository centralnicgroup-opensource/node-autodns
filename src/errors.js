var util = require('util')

function AutoDNSError (code, message, object) {
	this.name = this.constructor.name

	this.code = code
	this.message = message
	this.object = object

	Error.captureStackTrace(this)
}
util.inherits(AutoDNSError, Error)

AutoDNSError.prototype.toString = function () {
	return 'AutoDNS error #' + this.code + ': ' + this.message
}

exports.AutoDNSError = AutoDNSError
