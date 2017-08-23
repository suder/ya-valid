var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

var success = {
	status: "success"
};
var error = {
	status: "error",
	reason: 'Ошибка отправки формы...'
}
var progress = {
	status: "progress",
	timeout: 3000
}

app.post('/submit', function(req, res) {
	//console.log(req.body);	

	res.json(success); // [success || error || progress]
});

app.listen(3000, function () {
  console.log('Запущен на 3000');
});