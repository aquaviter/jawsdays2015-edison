/*
	edison.js
		Collect sensor data and put the data into Amazon Kinesis Stream.

    @author Hideyo Yoshida
    @version 1.0 2015/03/07

    Usage:
      node edison.js

 */

var m = require('mraa');
var AWS = require('aws-sdk');
var deviceName = 'edison1';
var partisionKey = deviceName;
var intervalmsec = 5000;

// Check arguments
//if (process.argv.length < 3) {
//  console.log('Error: Kinesis Stream Name is Missing.');
//  console.log('Usage: node server.js <kinesis stream name>');
//  return;
//}
var streamName = "jawsdays2015-handson-track2";

// Cognito settings
var cognitoParams = {
	AccountId: "",
	RoleArn: "",
	IdentityPoolId: ""
};

// Get a credential from Cognito 
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
AWS.config.credentials.get(function(err) {
	if (!err) {
		console.log("Cognito Identity Id: " + "AWS.config.credentils.identityId");
	}
});

// Kinesis settings
AWS.config.region = 'ap-northeast-1';
var kinesis = new AWS.Kinesis();

// Get sensed data from analog pin
var analogPin0 = m.Aio(0);



// loop: put sensor data
setInterval( function() {
	var value = analogPin0.read();
    var time = (new Date).getTiime()/1000;
	var record = {
		devicename: deviceName,
		time: time,
		value: value
	}
	var record = deviceName + ',' + (new Data).getTime()/1000 + ',' + value;
	console.log("sensor data: " + data);

	// Define kinesis parameters
	var kinesisParams = {
		Data: JSON.stringify(record),
		PartitionKey: partitionKey,
		StreanMane: streamName
	};

	// Put sensor data into kinesis stream
	kinesis.putRecord(kinesisParams, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log data;
		}
	});
}, intervalmsec);


