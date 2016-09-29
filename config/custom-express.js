var express = require('express');
var consign = require('consign'); /* autoload */
var bodyParser = require('body-parser'); /* body parsing middleware */

module.exports = function(){
  var app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  consign()
    .include('controllers')
    .into(app);

  return app;
}
