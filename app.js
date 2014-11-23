var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('appPath', 'public');
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
require('./server/routes')(app);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
