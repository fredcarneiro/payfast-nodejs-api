var logger = require('../services/logger.js');

module.exports = function (app){

  app.get('/pagamentos', function(request, response){
    response.send('Ok 2');
  });

  app.get('/pagamentos/pagamento/:id', function(request, response){
    var id = request.params.id;

    logger.info('consulting payment: ' + id);

    var memcachedClient = app.services.memcachedClient();

    memcachedClient.get('payment-' + id, function(error, data){

      if (error || !data) {
        logger.info("MISS - key not founded");

        var connection = app.persist.connectionFactory();
        var paymentDao = new app.persist.PaymentDAO(connection);

        paymentDao.searchById(id, function(error, result){
          if (error) {
            logger.info('Erro ao consultar no banco: ' + error);
            response.status(500).send();
            return;
          }

          logger.info('Pagamento encontrado: ' + JSON.stringify(result));
          response.json(result);

          return;
        });
      //HIT no cache
      }else{
        logger.info("HIT - key founded. Pagamento encontrado." + JSON.stringify(data));
        response.json(data);

        return;
      }

    });

  });

  app.delete('/pagamentos/pagamento/:id', function(request, response){

    var id = request.params.id;
    var payment = {};

    payment.id = id;
    payment.status = 'CANCELLED';

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

    request.assert('payment.payment_form', 'Payment form is required.').notEmpty();
    request.assert('payment.value', 'Value is required.').notEmpty();
    request.assert('payment.value', 'Value must be Decimal Number.').isFloat();

    var validation_errors = request.validationErrors();

    if (validation_errors) {
      console.log('Validation errors:' + validation_errors);
      response.status(400).send(validation_errors);
      return;
    }

    var payment = request.body["payment"];

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

        payment.id = result.insertId;

        console.log('payment created');

        var memcachedClient = app.services.memcachedClient();

        memcachedClient.set('payment-'+payment.id, payment, 60000,
          function(error){
            console.log('New key added to memcached. payment-'+payment.id);
          }
        );

        if (payment.payment_form == 'card') {
          var card = request.body["card"];
          var cardClient = new app.services.cardsClient();

          cardClient.authorize(card, function(exception, req, res, retorno){

            if (exception) {
              console.log(exception);
              response.status(400).send(exception);
              return;
            }

            console.log(retorno);

            response.location('/payments/payment/' + payment.id);

            var response_to_client = {
              payment_info: payment,
              card_info: card,
              links: [
                {
                  href: "/payments/payment/" + payment.id,
                  rel: "confirm",
                  method: "PUT"
                },
                {
                  href: "/payments/payment/" + payment.id,
                  rel: "cancel",
                  method: "DELETE"
                }
              ]
            }


            response.status(201).json(response_to_client);
            return;
          });
        }else{

          response.location('/payments/payment/' + payment.id);

          var response_to_client = {
            payment_info: payment,
            links: [
              {
                href: "/payments/payment/" + payment.id,
                rel: "confirm",
                method: "PUT"
              },
              {
                href: "/payments/payment/" + payment.id,
                rel: "cancel",
                method: "DELETE"
              }
            ]
          }

          response.status(201).json(response_to_client);
        }
      }

    });

  });

}
