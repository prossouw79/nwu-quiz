var path = require("path");
var listSource = require('./listSource');
var listTester = require('./listTester');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'client', 'index.html'));
    });

    app.get('/api/frameworkList/', function (req, res) {
        res.json(listSource.getRandomLists());
    })

    app.post('/api/frameworkList/', function (req, res) {
        var result = listTester.testList(req.body.model)
        res.json(result);
    })
}