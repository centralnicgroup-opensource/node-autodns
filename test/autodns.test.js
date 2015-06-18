var expect = require('chai').expect
var helpers = require('./helpers')

var AutoDNS = require('..')

// See InternetX/AutoDNS API documentation at:
//   https://login.autodns.com/files/downloads/1/autodns_interfacedocumentation_13.1.pdf

var AUTODNS_URL = process.env.AUTODNS_URL || 'https://demo.autodns.com/gateway/'
var AUTODNS_USER = process.env.AUTODNS_USER || 'test'
var AUTODNS_PASSWORD = process.env.AUTODNS_PASSWORD || 'test'
var AUTODNS_CONTEXT = process.env.AUTODNS_CONTEXT || '1'


describe('AutoDNS', function () {
	// AutoDNS is slow, so we need to up the default test timeout
	this.timeout(1000 * 10)

	var dns

	context('instance', function () {
		it('can be constructed', function () {
			dns = new AutoDNS({
				user: 'test',
				password: 'test'
			})
			expect(dns).to.be.an.instanceOf(AutoDNS)
		})

		it('has auth data', function () {
			expect(dns).to.have.deep.property('defaults.auth.user', 'test')
			expect(dns).to.have.deep.property('defaults.auth.password', 'test')
			expect(dns).to.have.deep.property('defaults.auth.context', '1')
		})

		it('has an XML builder and parser', function () {
			expect(dns).to.have.property('builder')
			expect(dns).to.have.property('parser')
		})

		it('defaults to live API endpoint', function () {
			expect(dns).to.have.property('url', 'https://gateway.autodns.com/')
		})

		it('defaults to English', function () {
			expect(dns).to.have.deep.property('defaults.language', 'en')
		})

		// set up actual AutoDNS instance for use in tests below
		it('accepts a custom API endpoint', function () {
			dns = new AutoDNS({
				url: AUTODNS_URL,
				user: AUTODNS_USER,
				password: AUTODNS_PASSWORD,
				context: AUTODNS_CONTEXT
			})
			expect(dns).to.be.an.instanceOf(AutoDNS)
			expect(dns).to.have.property('url', AUTODNS_URL)
		})
	})


	describe('Zone API', function () {
		it('can create a zone', function () {
			expect(dns).to.respondTo('createZone')
		})
		it('can update a zone', function () {
			expect(dns).to.respondTo('updateZone')
		})
		it('can delete a zone', function () {
			expect(dns).to.respondTo('deleteZone')
		})

		context('.createZone', function () {
			helpers.useNockFixture('zone-create.json')

			it('returns an error when nameservers have not been defined', function (done) {
				dns.createZone('example.com', null, function (err, res) {
					expect(err).to.exist
					expect(err).to.have.property('code', 'EF02025', err.toString())
					done()
				})
			})

			it('returns an error when SOA has not been defined', function (done) {
				dns.setZoneNameservers([
					'a.demo.autodns.com',
					'b.demo.autodns.com'
				])

				dns.createZone('example.com', null, function (err, res) {
					expect(err).to.exist
					expect(err).to.have.property('code', 'EF02057', err.toString())
					done()
				})
			})

			it('can create an empty zone', function (done) {
				dns.setZoneSOA({
					level: '1',
					email: 'node-autodns@devnullmail.com'
				})

				dns.createZone('example.com', null, function (err, res) {
					expect(err).to.not.exist
					expect(res).to.exists
					expect(res).to.have.deep.property('status.code', 'S0201')
					done()
				})
			})

			it('returns an error when creating a duplicate zone', function (done) {
				dns.createZone('example.com', null, function (err, res) {
					expect(err).to.exist
					expect(err).to.have.property('code', 'EF02019', err.toString())
					done()
				})
			})
		})
	})
})
