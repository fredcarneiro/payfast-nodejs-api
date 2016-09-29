var express = require('express');
var consign = require('consign'); /* autoload */
var bodyParser = require('body-parser'); /* body parsing middleware */
var expressValidator = require('express-validator'); /* validation middleware */

module.exports = function(){
  var app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator());

  consign()
    .include('controllers')
    .then('persist')
    .into(app);

  return app;
}
