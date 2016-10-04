module.exports = function (app){

  app.get('/pagamentos', function(request, response){
    response.send('Ok 2');
  });

  app.delete('/pagamentos/pagamento/:id', function(request, response){

    var id = request.params.id;
    var payment = {};

    payment.id = id;
    payment.status = 'CANCELADO';

    var connection = app.persist.connectionFactory();
    var paymentDao = new app.persist.PaymentDAO(connection);

    paymentDao.updatePayment(payment, function(error){

      if (error) {
        response.status(500).send(error);
        return;
      }

      response.status(204).send(payment);

    });

  });

  app.put('/pagamentos/pagamento/:id', function(request, response){

    var id = request.params.id;
    var payment = {};

    payment.id = id;
    payment.status = 'CONFIRMED';

    var connection = app.persist.connectionFactory();
    var paymentDao = new app.persist.PaymentDAO(connection);

    paymentDao.updatePayment(payment, function(error){

      if (error) {
        response.status(500).send(error);
        return;
      }

      response.send(payment);

    });

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

        pagamento.id = result.insertId;

        console.log('payment created');
        response.location('/payments/payment/' + pagamento.id);

        var response = {
          payment_info: payment,
          links: [
            {
              href: "/payments/payment/" + pagamento.id,
              rel: "confirm",
              method: "PUT"
            },
            {
              href: "/payments/payment/" + pagamento.id,
              rel: "cancel",
              method: "DELETE"
            }
          ]
        }

        response.status(201).json(response);
      }

    });

  });

}
