var fs = require('fs')
var glob = require('glob')

var files = glob.sync(__dirname + '/fixtures/*.json')

var replacements = {
	user: 'test',
	password: 'test',
	context: '1'
}

files.forEach(function (file) {
	var requests = require(file)
	var hasSensitiveData = false

	requests.forEach(function (req) {
		Object.keys(replacements).forEach(function (type) {
			var value = process.env['AUTODNS_' + type.toUpperCase()]
			if (value == null) return

			req.body = req.body.replace(new RegExp('(<auth>.*<' + type + '>)' + value + '(</' + type + '>.*</auth>)'), '$1' + replacements[type] + '$2')
			req.response = req.response.replace(new RegExp('(<object><type>' + type + '</type><value>)' + value + '(</value></object>)'), '$1' + replacements[type] + '$2')

			if (type === 'user' || type === 'password') {
				var pattern = new RegExp('.{0,10}' + value + '.{0,10}', 'g')
				var matches = JSON.stringify(req).match(pattern)
				if (matches) {
					matches.forEach(function (match) {
						console.warn('Found potential data leak:', match)
					})
					hasSensitiveData = true
				}
			}
		})
	})

	if (hasSensitiveData) {
		throw new Error('Found potential data leak')
	}

	fs.writeFileSync(file, JSON.stringify(requests, null, 2))
})
