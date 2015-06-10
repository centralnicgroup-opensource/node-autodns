var expect = require('chai').expect

var XML = require('../src/xml')
var xml = new XML({
	renderOpts: { pretty: false },
	headless: true
})

describe('XML', function () {
	context('.build', function () {
		it('should return valid XML', function () {
			var req = xml.build({
				user: 'test',
				password: 'test'
			})

			expect(req).to.be.a('string')
			expect(req).to.equal('<request><auth><user>test</user><password>test</password></auth></request>')
		})
	})
})
