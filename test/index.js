var expect = require('chai').expect

// See AutoDNS documentation at:
//   https://login.autodns.com/files/downloads/1/autodns_interfacedocumentation_13.1.pdf

describe('AutoDNS', function () {
	var dns

	context('instance', function () {
		it('can be constructed', function () {
			dns = new AutoDNS({
				user: 'test',
				password: 'test'
			})

			expect(dns).to.be.an.instanceOf(AutoDNS)
			expect(dns).to.have.property('options')
			expect(dns).to.have.deep.property('options.user', 'test')
			expect(dns).to.have.deep.property('options.password', 'test')
		})

		it('defaults to live API endpoint', function () {
			expect(dns).to.have.deep.property('options.url', 'https://gateway.autodns.com')
		})

		it('defaults to English', function () {
			expect(dns).to.have.deep.property('options.language', 'en')
		})
	})

	context('Zone API', function () {
		it('can create a zone', function () {
			expect(dns).to.respondTo('createZone')
		})
	})
})
