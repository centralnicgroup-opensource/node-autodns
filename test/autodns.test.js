var expect = require('chai').expect

var AutoDNS = require('..')

// See InternetX/AutoDNS API documentation at:
//   https://login.autodns.com/files/downloads/1/autodns_interfacedocumentation_13.1.pdf

describe('AutoDNS', function () {
	var dns

	context('instance', function () {
		it('can be constructed', function () {
			dns = new AutoDNS({
				user: 'test',
				password: 'test',
				xmlBuilder: {
					renderOpts: { pretty: false }
				}
			})
			expect(dns).to.be.an.instanceOf(AutoDNS)
		})

		it('has auth data', function () {
			expect(dns).to.have.deep.property('defaults.auth.user', 'test')
			expect(dns).to.have.deep.property('defaults.auth.password', 'test')
		})

		it('has an XML builder and parser', function () {
			expect(dns).to.have.property('builder')
			expect(dns).to.have.property('parser')
		})

		it('defaults to live API endpoint', function () {
			expect(dns).to.have.deep.property('url', 'https://gateway.autodns.com')
		})

		it('defaults to English', function () {
			expect(dns).to.have.deep.property('defaults.language', 'en')
		})
	})

	context('Zone API', function () {
		it('can create a zone', function () {
			expect(dns).to.respondTo('createZone')

			var req = dns.createZone('example.com', [])

			expect(req).to.be.a('string')
			expect(req).to.contain('<request>')
			expect(req).to.contain('<auth><user>test</user><password>test</password></auth>')
			expect(req).to.contain('<task>')
			expect(req).to.contain('<code>0201</code>')
			expect(req).to.contain('<zone><name>example.com</name></zone>')
		})
		it('can update a zone', function () {
			expect(dns).to.respondTo('updateZone')
		})
		it('can delete a zone', function () {
			expect(dns).to.respondTo('deleteZone')
		})
	})
})
