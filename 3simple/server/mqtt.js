if (Meteor.isServer) {

 // should be preinstalled with meteor npm install mqtt
 var mqtt = require('mqtt');
function createMqttClient(mqttClientUrl, mqttClientIdPrefix, mqttTopicPrefix, mqttOptions, appUID, processMessage) {
  var mqttTopic = mqttTopicPrefix + appUID;

  var s = (new Date).getTime();
  var mqttClientId = mqttClientIdPrefix + Math.floor(Math.random(s) * (999999 - 111111 + 1) + 111111);
  mqttOptions.clientId=mqttClientId;

  // Connect to the MQTT broker.
  console.log("Try to connect to ", mqttClientUrl, "with clientId ", mqttClientId);

  var mqttClient = mqtt.connect(mqttClientUrl, mqttOptions);

  mqttClient.on("message", Meteor.bindEnvironment(
      function (topic, message, mqttpacket) {
        processMessage(topic, message);
    })
  );

  mqttClient.on("connect", Meteor.bindEnvironment(
    function () {
      console.log("Connected to ", mqttClientUrl);
      mqttClient.subscribe(mqttTopic);
    })
  );

  mqttClient.on("error", Meteor.bindEnvironment(
    function (error) {
      console.log("MQTT error: " + error);
    })
  );

  mqttClient.on("close", Meteor.bindEnvironment(
    function () {
      console.log("MQTT close");
    })
  );

  mqttClient.on("offline", Meteor.bindEnvironment(
    function () {
      console.log("MQTT offline");
    })
  );
}



OpenHABMessage = {};

OpenHABMessage.processMessage = function(topic, message) {
console.log("receive on ", topic, " : " ,message);
}


Meteor.startup(function () {

    // Config parameters (given in file settings.json) meteor --settings settings.json
    createMqttClient(
      Meteor.settings.mqtt.mqttClientUrl,
      Meteor.settings.mqtt.mqttClientIdPrefix,
      Meteor.settings.mqtt.mqttTopicPrefix,
      Meteor.settings.mqtt.mqttOptions,
      Meteor.settings.mqtt.appUID,

      OpenHABMessage.processMessage

   );
});

}





