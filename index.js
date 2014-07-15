var detector  = require('./detector'),
    http      = require('http'),
    request   = require('request'),
    faye     = require('faye')
;

function start() {
  var port = Number(process.env.PORT || 8080);

  var server = http.createServer();
  server.listen(port);

  console.log("Started on port " + port);

  bayeux = new faye.NodeAdapter({mount: '/'});
  bayeux.attach(server);

  bayeux.getClient().subscribe('/messages', function(message) {
    detector.detect(message, function(command) {
      var channel = '/' + command.category;
      bayeux.getClient().publish(channel, JSON.stringify(command));
    });
  });
}

start()
