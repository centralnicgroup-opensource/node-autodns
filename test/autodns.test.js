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


	function expectRequest (req) {
		expect(req).to.be.a('string')
		expect(req).to.match(/<request>.*<auth>.*<\/auth>.*<\/request>/)
		expect(req).to.match(/<auth>.*<user>test<\/user>.*<\/auth>/)
		expect(req).to.match(/<auth>.*<password>test<\/password>.*<\/auth>/)
		expect(req).to.match(/<request>.*<task>.*<\/task>.*<\/request>/)
	}

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

				expectRequest(req)
				expect(req).to.match(/<task>.*<code>0201<\/code>.*<\/task>/)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<name>example\.com<\/name>.*<\/zone>/)
			})

			it('can create a zone with records', function () {
				var req = dns.createZone('example.com', [{
					name: 'www',
					type: 'CNAME',
					value: '@',
					ttl: '3600'
				}, {
					name: '@',
					type: 'MX',
					priority: '10',
					value: 'mail.example.com'
				}])

				expectRequest(req)
				expect(req).to.match(/<task>.*<code>0201<\/code>.*<\/task>/)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<name>example\.com<\/name>.*<\/zone>/)
				expect(req).to.match(/<zone>.*<rr><name>www<\/name><type>CNAME<\/type><value>@<\/value><ttl>3600<\/ttl><\/rr>.*<\/zone>/)
				expect(req).to.match(/<zone>.*<rr><name>@<\/name><type>MX<\/type><value>mail\.example\.com<\/value><pref>10<\/pref><\/rr>.*<\/zone>/)
			})

			it('can create a zone with SOA preset', function () {
				dns.setZoneSOA({
					email: 'hostmaster@example.com'
				})

				var req = dns.createZone('example.com')

				expectRequest(req)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<ns_action>complete<\/ns_action>.*<\/zone>/)
				expect(req).to.match(/<zone>.*<soa>.*<\/soa>.*<\/zone>/)
				expect(req).to.match(/<soa>.*<level>1<\/level>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<email>hostmaster@example\.com<\/email>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<ttl>.*<\/ttl>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<refresh>.*<\/refresh>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<retry>.*<\/retry>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<expire>.*<\/expire>.*<\/soa>/)

				dns.setZoneSOA({
					level: '2',
					email: 'hostmaster@example.com',
					ignore: '1'
				})

				var req = dns.createZone('example.com')

				expectRequest(req)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<soa>.*<\/soa>.*<\/zone>/)
				expect(req).to.match(/<soa>.*<level>2<\/level>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<email>hostmaster@example\.com<\/email>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<ignore>1<\/ignore>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<ttl>.*<\/ttl>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<refresh>.*<\/refresh>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<retry>.*<\/retry>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<expire>.*<\/expire>.*<\/soa>/)
			})

			it('can create a zone with custom SOA', function () {
				dns.setZoneSOA({
					ttl: '3600',
					refresh: '86400',
					retry: '7200',
					expire: '3600000'
				})

				var req = dns.createZone('example.com')

				expectRequest(req)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<soa>.*<\/soa>.*<\/zone>/)
				expect(req).to.match(/<soa>.*<level>0<\/level>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<ttl>3600<\/ttl>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<refresh>86400<\/refresh>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<retry>7200<\/retry>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<expire>3600000<\/expire>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<email>.*<\/email>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<ignore>.*<\/ignore>.*<\/soa>/)
			})

			it('can create a zone with partial SOA', function () {
				dns.setZoneSOA({
					ttl: '3600',
					email: 'hostmaster@example.com'
				})

				var req = dns.createZone('example.com')

				expectRequest(req)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<soa>.*<\/soa>.*<\/zone>/)
				expect(req).to.match(/<soa>.*<level>0<\/level>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<ttl>3600<\/ttl>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<refresh>43200<\/refresh>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<retry>7200<\/retry>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<expire>1209600<\/expire>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<email>hostmaster@example\.com<\/email>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<ignore>.*<\/ignore>.*<\/soa>/)

				dns.setZoneSOA({
					retry: '600',
					ignore: '0'
				})

				var req = dns.createZone('example.com')

				expectRequest(req)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<soa>.*<\/soa>.*<\/zone>/)
				expect(req).to.match(/<soa>.*<level>0<\/level>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<ttl>86400<\/ttl>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<refresh>43200<\/refresh>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<retry>600<\/retry>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<expire>1209600<\/expire>.*<\/soa>/)
				expect(req).to.match(/<soa>.*<ignore>0<\/ignore>.*<\/soa>/)
				expect(req).to.not.match(/<soa>.*<email>.*<\/email>.*<\/soa>/)
			})

			it('can create a zone with nameservers', function () {
				dns.setZoneNameservers([
					'ns1.example.com',
					{ name: 'ns2.example.com' },
					{ name: 'ns3.example.com', ttl: 3600 }
				])

				var req = dns.createZone('example.com')

				expectRequest(req)
				expect(req).to.match(/<task>.*<zone>.*<\/zone>.*<\/task>/)
				expect(req).to.match(/<zone>.*<nserver><name>ns1\.example\.com<\/name><\/nserver>.*<\/zone>/)
				expect(req).to.match(/<zone>.*<nserver><name>ns2\.example\.com<\/name><\/nserver>.*<\/zone>/)
				expect(req).to.match(/<zone>.*<nserver><name>ns3\.example\.com<\/name><ttl>3600<\/ttl><\/nserver>.*<\/zone>/)
			})
		})
	})
})
