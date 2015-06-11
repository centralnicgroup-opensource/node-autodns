function AutoDNS (opts) {
	this.options = {
		url: opts.url || 'https://gateway.autodns.com',
		language: opts.language || 'en'
	}
	this.defaults = {}
}


AutoDNS.prototype.setZoneMain = function (main) {
	var zone = this.defaults.zone = this.defaults.zone || {}
	zone.ns_action = zone.ns_action || 'complete'
	zone.main = {
		value: main.value || main,
		ttl: main.ttl || '86400'
	}
}

AutoDNS.prototype.setZoneSOA = function (soa) {
	var zone = this.defaults.zone = this.defaults.zone || {}
	zone.ns_action = zone.ns_action || 'complete'
	zone.soa = {}

	if (+soa.level) {
		zone.soa.level = soa.level
	}
	else {
		// Recommended settings from AutoDNS docs
		zone.soa.level = '0'
		zone.soa.ttl = soa.ttl || '86400'
		zone.soa.refresh = soa.refresh || '43200'
		zone.soa.retry = soa.retry || '7200'
		zone.soa.expire = soa.expire || '1209600'
	}

	if ('ignore' in soa) zone.soa.ignore = soa.ignore
	if ('email' in soa) zone.soa.email = soa.email
}

AutoDNS.prototype.setZoneNameservers = function (nameservers) {
	var zone = this.defaults.zone = this.defaults.zone || {}
	zone.nserver = nameservers.map(function (ns) {
		return {
			name: ns.name || ns,
			ttl: ns.ttl || '86400'
		}
	})
}


AutoDNS.prototype.createZone = function () {
	
}

AutoDNS.prototype.updateZone = function () {
	
}

AutoDNS.prototype.deleteZone = function () {

}


module.exports = AutoDNS
