var path = require('path')

exports.useNockFixture = function (filename) {
	var nock = require('nock')
	var nockDone

	nock.back.fixtures = path.join(__dirname, 'fixtures')

	before(function (done) {
		nock.back(filename, function (cb) {
			nockDone = cb
			nock.enableNetConnect()
			done()
		})
	})

	after(function () {
		nockDone()
	})
}
