var express = require('express')
var app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', (process.env.PORT || 5000));
app.set('appPath', require('path').normalize(__dirname + '/../public/'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(app.get('appPath')));
require('./routes')(app);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
