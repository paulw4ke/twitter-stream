var express = require("express");
var app = express();
app.set('view engine', 'ejs');

var Twitter = require('twitter');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 1337;
 
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var _stream = {};
 
 app.get('/', function(req, res) {
    res.render('index');
});

io.on('connection', function(socket){
	var clientCount = io.engine.clientsCount;	
	console.log('message', 'User connected');
	console.log(clientCount + ' user(s) connected.');
	
	if (clientCount === 1) {
		startStream(socket, 'javascript');
	}
	
	socket.on('disconnect', function () {
		var clientCount = io.engine.clientsCount;
		console.log('User disconnected.');
		console.log(clientCount + ' user(s) connected.');
		if (clientCount === 0) {
			endStream();
		}	
	});
});

function startStream (socket, term) {
	client.stream('statuses/filter', {track: term}, function(stream) {
		console.log('Starting stream');
		_stream = stream;
		stream.on('data', function(tweet) {
			console.log(tweet.text);
			io.emit('message', tweet.text);
		});
	 
		stream.on('error', function(error) {
			console.log(error);
			throw error;
		});
	});	
}

function endStream() {
	console.log('Ending stream');
	_stream.destroy();
}

http.listen(port, function(){
  console.log('listening on *:' + port);
});

//client.stream('statuses/filter', {follow: 'user_id'}, function(stream) {
	/*
client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
	stream.on('data', function(tweet) {
		io.emit('message', tweet.text);
	});
	 
	stream.on('error', function(error) {
		console.log(error);
		throw error;
	});
});	
*/


/*var params = {screen_name: 'screen_name'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
	  for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	  }
  }
});*/
