var restify = require('restify');

function cardsClient(){
  this._client = restify.createJsonClient({
    url: 'http://localhost:3001'
  });
}

cardsClient.prototype.authorize = function(card, callback){
  this._client.post('/cartoes/autoriza', card, callback);
}

module.exports = function() {
  return cardsClient;
}
