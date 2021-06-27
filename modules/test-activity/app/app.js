const express = require('express');
const configJSON = require('../config/config-json');
var cors = require('cors');
var http = require('http');

// setup the test-activity example app
module.exports = function testActivity(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/test-activity`;

    app.use(cors());

    // setup static resources
    app.use('/modules/test-activity/dist', express.static(`${moduleDirectory}/dist`));
    app.use('/modules/test-activity/images', express.static(`${moduleDirectory}/images`));

    // setup the index redirect
    app.get('/modules/test-activity/', function(req, res) {
        return res.redirect('/modules/test-activity/index.html');
    });

    // setup index.html route
    app.get('/modules/test-activity/index.html', function(req, res) {
        // you can use your favorite templating library to generate your html file.
        return res.sendFile(`${moduleDirectory}/html/index.html`);
    });

    // setup config.json route
    app.get('/modules/test-activity/config.json', function(req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.status(200).json(configJSON(req));
    });

    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    //
    // CONFIGURATION
    // ```````````````````````````````````````````````````````
    // Reference:
    // https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm

    /**
     * Called when a journey is saving the activity.
     * @return {[type]}     [description]
     * 200 - Return a 200 iff the configuraiton is valid.
     * 30x - Return if the configuration is invalid (this will block the publish phase)
     * 40x - Return if the configuration is invalid (this will block the publish phase)
     * 50x - Return if the configuration is invalid (this will block the publish phase)
     */
    app.post('/modules/test-activity/save', function(req, res) {
        console.log('debug: /modules/test-activity/save');
        return res.status(200).json({});
    });

    /**
     * Called when a Journey has been published.
     * This is when a journey is being activiated and eligible for contacts
     * to be processed.
     * @return {[type]}     [description]
     * 200 - Return a 200 iff the configuraiton is valid.
     * 30x - Return if the configuration is invalid (this will block the publish phase)
     * 40x - Return if the configuration is invalid (this will block the publish phase)
     * 50x - Return if the configuration is invalid (this will block the publish phase)
     */
    app.post('/modules/test-activity/publish', function(req, res) {
        console.log('debug: /modules/test-activity/publish');
        return res.status(200).json({});
    });

    /**
     * Called when Journey Builder wants you to validate the configuration
     * to ensure the configuration is valid.
     * @return {[type]}
     * 200 - Return a 200 iff the configuraiton is valid.
     * 30x - Return if the configuration is invalid (this will block the publish phase)
     * 40x - Return if the configuration is invalid (this will block the publish phase)
     * 50x - Return if the configuration is invalid (this will block the publish phase)
     */
    app.post('/modules/test-activity/validate', function(req, res) {
        console.log('debug: /modules/test-activity/validate');
        return res.status(200).json({});
    });


    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    //
    // EXECUTING JOURNEY
    // ```````````````````````````````````````````````````````

    /**
     * Called when a Journey is stopped.
     * @return {[type]}
     */
    app.post('/modules/test-activity/stop', function(req, res) {
        console.log('debug: /modules/test-activity/stop');
        return res.status(200).json({});
    });

    /**
     * Called when a contact is flowing through the Journey.
     * @return {[type]}
     * 200 - Processed OK
     * 3xx - Contact is ejected from the Journey.
     * 4xx - Contact is ejected from the Journey.
     * 5xx - Contact is ejected from the Journey.
     */
    app.post('/modules/test-activity/execute', function(req, res) {
        const request = req.body;

        console.log("req.body::", JSON.stringify(req.body));

        let temperature = "";
        // Weather API call starts here

        var options = {
            host: 'api.weatherapi.com',
            path: '/v1/current.json?key=9a51539a381a439f807105434213105&q=' + request.inArguments[0].dummyInput + '&aqi=no'
        };
        
        var apiReq = http.get(options, function(apiRes) {
        console.log('STATUS: ' + apiRes.statusCode);
        console.log('HEADERS: ' + JSON.stringify(apiRes.headers));
        
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        return apiRes.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = JSON.parse(Buffer.concat(bodyChunks));
            console.log('BODY: ' + body);
            // ...and/or process the entire body here.
            temperature = body.current.temp_c;

            const responseObject = {
                dummyOutput: temperature // request.inArguments[0].dummyInput + "dummyOutput_1234"
            };
    
            console.log('Response Object', JSON.stringify(responseObject));
    
            return res.status(200).json(responseObject);
        })
        });
        
        apiReq.on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });

        // Weather API call ends here
    });

};
