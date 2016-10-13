module.exports = function(app){

  app.post('/correios/calculo-prazo', function(request, response){

    var dadosEntrega = request.body;
    var correiosSOAPClient = new app.services.correiosSOAPClient();

    correiosSOAPClient.calculaPrazo(dadosEntrega, function(error, result){

      if(error){
        response.status(500).send(error);
        return;
      }

      console.log('time calculated');

      response.json(result);

    });

  });


}
