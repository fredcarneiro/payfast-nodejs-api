var fs = require('fs');

fs.createReadStream('../files/image.jpg')
.pipe(fs.createWriteStream('../files/imagem_stream.jpg'))
.on('finish', function(){ /* listener to when the pipe function ends */
  console.log('image created using stream');
});
