
var request = require("request")

request({
    url: 'http://fundraising.one.gov.hk/fundraise_query/webservice/psi/json',
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        console.log(body) // Print the json response
    }
})
