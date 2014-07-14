var request  = require('request'),
    settings = require('env-settings')
;

module.exports.route = function(command) {
  var endpoint = settings.urls[command.category]
  console.log("Attempting to contact endpoint: " + endpoint + " for command: " + JSON.stringify(command));
  request.post(endpoint, {body: JSON.stringify(command)}, function (err, response, body) {
    if (err) {
      console.error("Unable to reach " + command.category + " unit")
      return console.error(err);
    }
  })
}
