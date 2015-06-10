function AutoDNS (opts) {
	opts.url = opts.url || 'https://gateway.autodns.com'
	opts.language = opts.language || 'en'

	this.options = opts
}

AutoDNS.prototype.createZone = function () {
	
}

AutoDNS.prototype.updateZone = function () {
	
}

AutoDNS.prototype.deleteZone = function () {

}


module.exports = AutoDNS
