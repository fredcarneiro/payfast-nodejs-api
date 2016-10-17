var fs = require('fs');

module.exports = function(app){

  app.post('/upload/image', function(request, response){

    console.log('receiving image');

    //var body = request.body; /* buffer mode */
    var image_name = request.headers.filename;
    request.pipe(fs.createWriteStream('files/'+image_name))
    .on('finish', function(){
      console.log('image received.');
      response.status(201).send('Ok');
    });



  });

}
