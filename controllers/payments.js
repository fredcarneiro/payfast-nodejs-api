module.exports = function (app){

  app.get('/pagamentos', function(request, response){
    response.send('Ok 2');
  });

  app.post('/pagamentos/pagamento', function(request, response){

    request.assert('payment_form', 'Payment form is required.').notEmpty();
    request.assert('value', 'Value is required.').notEmpty();
    request.assert('value', 'Value must be Decimal Number.').isFloat();

    var validation_errors = request.validationErrors();

    if (validation_errors) {
      console.log('Validation errors:' + validation_errors);
      response.status(400).send(validation_errors);
      return;
    }

    var payment = request.body;

    console.log('processing new payment.');

    payment.status = 'CREATED';
    payment.data = new Date;

    var connection = app.persist.connectionFactory();
    var paymentDao = new app.persist.PaymentDAO(connection);

    paymentDao.save(payment, function(error, result){

      if (error) {
        response.status(500).send('Error while inserting:' + error);
        console.log(error);
      }else{
        console.log('payment created');
        response.location('/payments/payment/' + result.insertId);
        response.status(201).json(payment);
      }

    });

  });

}
