const line = require('@line/bot-sdk');
const express = require('express');
var request = require('request');

// create LINE SDK config from env variables
const config = {
    channelAccessToken = 'vkpgLcSMJ9Cn/E9FEOMpRdf8GP77ruAhTG+CCqyP4wCSsTl9woYXl0kyl3dK6vJrQMxbu0JdW3zwGKeSUqj1wzQWjxIZhhXQRDHVI2KKYiQq3SqPJR/oZTFFlqppD9l9kV0o5qPCKZVKG3PkYj4C/QdB04t89/1O/w1cDnyilFU=',
    channelSecret = '99e27acc992b83d9ff38523ff67326f0',
};

// create LINE SDK client
const client = new line.Client(config);

// create express app
const app = express();

// register a webhook handler with middleware
app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    var options = {
        method: 'GET',
        url: 'https://api.susi.ai/susi/chat.json',
        qs: {
            timezoneOffset: '-330',
            q: event.message.text
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        // answer fetched from susi
        var ans = (JSON.parse(body)).answers[0].actions[0].expression;

        // create a echoing text message
        const answer = {
            type: 'text',
            text: ans
        };

        // use reply API
        return client.replyMessage(event.replyToken, answer);
    });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});