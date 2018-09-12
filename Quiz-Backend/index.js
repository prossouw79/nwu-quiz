// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');

var mailer = require('./aws-ses');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var port = process.env.PORT || 3000; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router


function shuffle(arrIn) {
    //copy array

    var a = arrIn.slice(0);

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    if (!arraysEqual(arrIn, a))
        return a;
    else
        return shuffle(arrIn);
}

function arraysEqual(a1, a2) {
    return JSON.stringify(a1) === JSON.stringify(a2);
}

function pluck(array, key) {
    return array.map(o => o[key]);
}

var icons = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png','f.png','g.png','h.png','i.png', 'j.png'];
var names = ['Angular', 'Typescript', 'React', 'NodeJS', 'Vue','Visual Studio Code', 'Postman', 'Bootstrap', 'GitHub','Electron'];
var descr = [
    `JS Framework by Google that extends HTML markup, adds two-way binding of M-V layers.`,
    `A superset of JS developed by Microsoft, characterized by adding static typing (optional).`,
    `Facebook's JS library used to build single page applications.`,
    `JS runtime often used for a serverside 'back-end', built on Chrome's V8 JS engine.`,
    `JS Framework for building user interfaces that allows for incremental adoption.`,
    `Extensible cross-platform code editor by Microsoft.`,
    `Tool for debugging Application Programming Interfaces (APIs).`,
    `CSS and JS Framework for building responsive, mobile-first projects.`,
    `Online platform for hosting source code, managing projects and building software collaboratively.`,
    `Toolkit that allows developers to create cross-platform desktop applications using web technologies.`
]

var correctAnswers = [];


router.get('/frameworkList', function (req, res) {

    var lists = {
        Icons: {
            name: "Icons:",
            allowedTypes: ['Icon'],
            items: []
        },
        Names: {
            name: "Names:",
            allowedTypes: ['Name'],
            items: []
        },
        Descriptions: {
            name: "Description:",
            allowedTypes: ['Description'],
            items: []
        }
    }

    icons.forEach(i => {
        lists.Icons.items.push({
            type: 'Icon',
            label: i
        })
    });

    names.forEach(n => {
        lists.Names.items.push({
            type: 'Name',
            label: n
        })
    });

    descr.forEach(d => {
        lists.Descriptions.items.push({
            type: 'Description',
            label: d
        })
    });

    lists.Names.items = shuffle(lists.Names.items);
    lists.Descriptions.items = shuffle(lists.Descriptions.items);

    res.json(lists);
});

router.post('/frameworkList', function (req, res) {
    var model = req.body.model;


    var userEmail = model.email;
    var lists = model.lists;

    var rIcons = pluck(lists.Icons.items, 'label');
    var rNames = pluck(lists.Names.items, 'label');
    var rDescriptions = pluck(lists.Descriptions.items, 'label');

    var correct = arraysEqual(rIcons, icons) && arraysEqual(rNames, names) && arraysEqual(rDescriptions, descr);
    var timestamp = new Date();
    if (correct) {
        var alreadyAnswered = _.some(correctAnswers, function (i) {
            return i.email == userEmail;
        })


        if (!alreadyAnswered) {

            correctAnswers.push({
                email: userEmail,
                time: timestamp
            });

            correctAnswers = _.sortBy(correctAnswers, function (dateObj) {
                return dateObj.date;
            });

            if (correctAnswers.length == 3) {
                var html = "<h3>Top 3</h3> <br> <ol>";

                correctAnswers.forEach(a => {
                    html += `<li>${a.email} : ${a.time.toLocaleTimeString()} </li>`
                });
                html += `</ol>`;

                mailer.sendResults(html, "", "Quiz Results", "pieter@synthesis.co.za");
            }


            fs.writeFileSync(`./correctAnswers.json`, JSON.stringify(correctAnswers), {
                encoding: 'utf8',
                flag: 'w'
            });

            res.send({
                result: true,
                answers: [],
                comment: "Your submission was correct!"
            });
        } else {
            res.send({
                result: false,
                answers: [],
                comment: 'Already answered correctly.'
            });
        }
    } else {
        res.send({
            result: false,
            answers: [],
            comment: "Your submission was incorrect, try again..."
        })
    }


})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);