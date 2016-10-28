var express = require('express');
var consign = require('consign'); /* autoload */
var bodyParser = require('body-parser'); /* body parsing middleware */
var expressValidator = require('express-validator'); /* validation middleware */
var morgan = require('morgan')
var logger = require('../services/logger.js')

module.exports = function(){
  var app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());
  app.use(morgan("common", {
    stream: {
      write: function(message){
        logger.info(message)
      }
    }
  }));

  consign()
    .include('controllers')
    .then('persist')
    .then('services')
    .into(app);

  return app;
}
