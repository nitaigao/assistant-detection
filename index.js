var detector = require('./detector'),
    router   = require('./router'),
    http     = require('http'),
    request  = require('request')
;

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
        var sentence = JSON.parse(body);
        detector.detect(sentence.text, function(command) {
          if (sentence.callback != undefined) {
            var result = JSON.stringify({result: command})
            request.post(sentence.callback, {body: result})
          }
          router.route(command);
        });
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
