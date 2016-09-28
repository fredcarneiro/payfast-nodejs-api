module.exports = function (app){
  app.get('/pagamentos', function(request, response){
    response.send('Ok 2');
  });
}
