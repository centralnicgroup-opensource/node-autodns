var expect = require('chai').expect

var XML = require('../src/xml')
var xml = new XML({
	renderOpts: { pretty: false },
	headless: true
})

// Options that are normally contained within AutoDNS
var options = {
	user: 'test',
	password: 'test'
}

describe('XML', function () {
	context('.build', function () {
		it('should return valid XML', function () {
			var req = xml.build(options)

			expect(req).to.be.a('string')
			expect(req).to.equal('<request><auth><user>test</user><password>test</password></auth></request>')
		})
	})
	context('.ZoneCreate', function () {
		context('.build', function () {
			it('should return valid XML', function () {
				var req = xml.ZoneCreate.build(options, {
					records: ''
				})

				expect(req).to.be.a('string')
				expect(req).to.equal('<request><auth><user>test</user><password>test</password></auth></request>')
			})
		})
	})
})
