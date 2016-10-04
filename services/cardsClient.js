var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:3001'
});

client.post('/cartoes/autoriza', card, function(error, request, response, retorno){
  console.log('using the cards service.');
  console.log(retorno);
});
