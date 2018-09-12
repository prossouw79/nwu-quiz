var helpers = require('./helpers');
var listSource = require('./listSource');
var _ = require('lodash');
var fs = require('fs');
var mailer = require('./aws-ses')

var correctAnswers = [];


module.exports = {
    getCorrectAnswers : function(){
        return correctAnswers;
    },
    testList: function (model) {
        console.log("Got ", model);

        var userEmail = model.email;
        var lists = model.lists;

        var rIcons = helpers.pluck(lists.Icons.items, 'label');
        var rNames = helpers.pluck(lists.Names.items, 'label');
        var rDescriptions = helpers.pluck(lists.Descriptions.items, 'label');

        var correct = helpers.arraysEqual(rIcons, listSource.getIcons()) && helpers.arraysEqual(rNames, listSource.getNames()) && helpers.arraysEqual(rDescriptions, listSource.getDescriptions());
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

                return {
                    result: true,
                    answers: [],
                    comment: "Your submission was correct!"
                }

            } else {
                return {
                    result: false,
                    answers: [],
                    comment: 'Already answered correctly.'
                };
            }
        } else {
            return {
                result: false,
                answers: [],
                comment: "Your submission was incorrect, try again..."
            }
        }
    }
}