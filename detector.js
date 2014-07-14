var request  = require ('request')
    qs       = require('querystring')
;

module.exports.detect = function(sentence, cb) {
  var options = {
    url: 'https://api.wit.ai/message?q=' + qs.escape(sentence),
    headers: {"Authorization": "Bearer UE47AC55EFCKJM2WQCIDFBT5F3RK5EGW" }
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
      var message = JSON.parse(body)
      for (var i = 0; i < message.outcomes.length; i++) {
        var command = {"category": message.outcomes[i].intent, "commands": message.outcomes[i].entities}
        cb(command);
      }
    }
  })
}
