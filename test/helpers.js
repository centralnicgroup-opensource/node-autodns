var path = require('path')

exports.useNockFixture = function (filename) {
	var nock = require('nock')
	var nockDone

	nock.back.fixtures = path.join(__dirname, 'fixtures')

	beforeEach(function (done) {
		nock.back(filename, function (cb) {
			nockDone = cb
			nock.enableNetConnect('demo.autodns.com')
			done()
		})
	})

	afterEach(function () {
		nockDone()
	})
}
