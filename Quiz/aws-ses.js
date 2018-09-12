// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/cred.json')

var sendResults = function (_html, _text, _subject, _email) {

    // Create sendEmail params 
    var params = {
        Destination: { /* required */
            CcAddresses: [],
            ToAddresses: [
                _email,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: _html
                },
                Text: {
                    Charset: "UTF-8",
                    Data: _text
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: _subject
            }
        },
        Source: _email,
        ReplyToAddresses: [
            _email,
        ],
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({
        apiVersion: '2010-12-01'
    }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function (data) {
            console.log(data.MessageId);
        }).catch(
        function (err) {
            console.error(err, err.stack);
        });
}

module.exports = {
    sendResults
}