module.exports = function (app){

  app.get('/pagamentos', function(request, response){
    response.send('Ok 2');
  });

  app.post('/pagamentos/pagamento', function(request, response){
    var payment = request.body;
    console.log(payment);
    response.send('Ok Post.');
  });

}
