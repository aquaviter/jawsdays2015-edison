/*
	main.js
		Collect sensor data and put the data into Amazon Kinesis Stream.

    @author Hideyo Yoshida
    @version 1.1 2015/03/14

    Usage:
      node main.js

 */

var m   = require('mraa');
var lcd = require('jsupm_i2clcd');
var AWS = require('aws-sdk');

// Edison and AWS Settings
var deviceName   = 'edison1';
var partitionKey = deviceName;
var intervalmsec = 1000;
var streamName   = "jawsdays2015";

// Cognito settings
var cognitoParams = {
	AccountId: "xxxxxxxxxxxx",
	RoleArn: "arn:aws:iam::xxxxxxxxxxxx:role/Cognito_IoTHandson2Unauth_DefaultRole",
	IdentityPoolId: "us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx"
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

// Initialized sensors and devices
var analogPin0 = new m.Aio(0);
var myLCD      = new lcd.Jhd1313m1(6, 0x3E, 0x62);
var clearStr   = "                         ";

// loop: put sensor data
setInterval( function() {
	
    // Retrieve sensor data
    var value = analogPin0.read();
    
    // Display sensed analog data on LCD
    myLCD.setColor(0, 255, 0);
    myLCD.setCursor(0,0);   
    myLCD.write(clearStr);
    myLCD.setCursor(0,0);
    myLCD.write("DATA: " + value);
    
    // Compose message with device name, timestamp, value
	var record = {
		devicename: deviceName,
		timestamp: (new Date).getTime()/1000|0,
		value: value
	};
    console.log("timestamp= " + record.timestamp + ", value=" + record.value);
    
	// Define kinesis parameters
	var kinesisParams = {
		Data: JSON.stringify(record),
		PartitionKey: partitionKey,
		StreamName: streamName
	};

	// Put sensor data into kinesis stream
	kinesis.putRecord(kinesisParams, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log(data);
		}
	});
}, intervalmsec);


