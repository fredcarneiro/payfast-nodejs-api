var fs = require('fs');

fs.readFile('../files/image.jpg', function(error, buffer){
  console.log('buffer readed.');
  fs.writeFile('../files/imagem2.jpg', buffer, function(err){
    console.log('new image created.');
  });
});
