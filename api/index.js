require('babel/register');

var port = process.env.PORT || 7070;

require('./api.js').listen(port);

console.log('API running on port ' + port);
