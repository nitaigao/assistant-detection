var http     = require('http'),
    qs       = require('querystring'),
    request  = require('request')
    settings = require('env-settings')
;

function sendToRouter(command) {
  var commandString = JSON.stringify(command)
  console.log("Sending To Router:\n" + commandString)
  request.post(settings.urls.router, {body: commandString}, function (err, response, body) {
    if (err) {
      console.error("Unable to reach router")
      return console.error(err);
    }
  })
}

function detectCommand(command) {
  var options = {
    url: 'https://api.wit.ai/message?q=' + qs.escape(command.text),
    headers: {"Authorization": "Bearer UE47AC55EFCKJM2WQCIDFBT5F3RK5EGW" }
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
      var message = JSON.parse(body)

      if (command.callback != undefined) {
        var resultData = JSON.stringify({result: body})
        request.post(command.callback, {body: resultData})
      }

      for (var i = 0; i < message.outcomes.length; i++) {
        console.log(message.outcomes[i].intent)
        var routeCommand = {"category": message.outcomes[i].intent, "commands": message.outcomes[i].entities}
        sendToRouter(routeCommand)
      }

    }
  })
}

function createServer(port) {
  http.createServer(function (req, res) {
    var body = "";

    req.on('data', function (chunk) {
      body += chunk;
    })

    req.on('end', function () {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end('OK!');

      if (body.length > 0) {
        console.log(body);
        var formData = JSON.parse(body);
        detectCommand(formData)
      }
    });
  }).listen(port)
}

function start() {
  var port = Number(process.env.PORT || 8080);
  console.log("Started on port " + port)
  createServer(port);
}

start()
