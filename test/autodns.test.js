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
		})
		it('can update a zone', function () {
			expect(dns).to.respondTo('updateZone')
		})
		it('can delete a zone', function () {
			expect(dns).to.respondTo('deleteZone')
		})

		context('.createZone', function () {
			it('can create an empty zone', function () {
				var req = dns.createZone('example.com')

				expect(req).to.be.a('string')
				expect(req).to.contain('<request>')
				expect(req).to.contain('<auth><user>test</user><password>test</password></auth>')
				expect(req).to.contain('<task>')
				expect(req).to.contain('<code>0201</code>')
				expect(req).to.contain('<zone><name>example.com</name></zone>')
			})

			it('can create a zone with records', function () {
				var req = dns.createZone('example.com', [{
					name: 'www',
					type: 'CNAME',
					value: '@'
				}, {
					name: '@',
					type: 'MX',
					pref: '10',
					value: 'mail.example.com'
				}])

				expect(req).to.be.a('string')
				expect(req).to.contain('<request>')
				expect(req).to.contain('<auth><user>test</user><password>test</password></auth>')
				expect(req).to.contain('<task>')
				expect(req).to.contain('<code>0201</code>')
				expect(req).to.contain('<zone>')
				expect(req).to.contain('<rr><name>www</name><type>CNAME</type><value>@</value></rr>')
				expect(req).to.contain('<rr><name>@</name><type>MX</type><pref>10</pref><value>mail.example.com</value></rr>')
			})

			it('can create a zone with SOA defaults', function () {
				dns.setZoneSOA({
					ttl: '3600',
					refresh: '86400',
					retry: '7200',
					expire: '3600000',
					email: 'hostmaster@example.com'
				})

				var req = dns.createZone('example.com')

				expect(req).to.be.a('string')
				expect(req).to.contain('<zone>')
				expect(req).to.contain('<soa><level>0</level><ttl>3600</ttl><refresh>86400</refresh><retry>7200</retry><expire>3600000</expire><email>hostmaster@example.com</email></soa>')
			})
		})
	})
})
