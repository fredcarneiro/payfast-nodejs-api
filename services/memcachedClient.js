var memcached = require('memcached');

var client = new memcached('localhost:11211', {
  retries: 10,
  retry: 10000,
  remove: true
});

/*client.set('payment-20',
  {
    'id': 20
  },
  60000,
  function(error){
    console.log('New key added to memcached. payment-20.');
  }
);*/

client.get('payment-20', function(error, data){

  if (error || !data) {
    console.log("MISS - key not founded");
  }else{
    console.log("HIT - key founded. " + JSON.stringify(data));
  }

});
