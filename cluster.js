var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

if (cluster.isMaster){
	
	cpus.forEach(function(){
		cluster.fork(); //slave
	});

	cluster.on('listening', function(worker){
		console.log('Cluster connected ' + worker.process.pid);
	});

	cluster.on('exit', worker => {
		console.log('Cluster %d exited ', worker.process.pid);
		cluster.fork();
	});

}else{
	require('./index.js');
}
