import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {check, request, requestNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default function App() {
  const permission = PERMISSIONS.ANDROID.CAMERA;
  check(permission).then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  }).catch((error) => {
    console.log('Error ' + error);
  });

  const rationale = {
    title: "Bitte, Bitte",
    message: "Please give me the requested permission",
    buttonPositive: "Gerne",
    buttonNegative: "Geh weg",
    buttonNeutral: "Mir doch egal"
  };
  request(permission, rationale).then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  }).catch((error) => {
    console.log('Error ' + error);
  });

  requestNotifications(['alert', 'sound']).then(({status, settings}) => {
    console.log('Status: ' + status + ' settings: ' + settings);
  });
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
	<Text> this is the second line </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
