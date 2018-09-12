var express = require('express');
var port = 8080;

var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');


app.use(express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(cors({origin: '*'}));

require('./routes')(app);


var server = app.listen(port, function () {
    console.log(`Node server is running on port ${port}`);
});