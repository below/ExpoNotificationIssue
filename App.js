import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useState } from "react";

import {check, request, requestNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';
import * as Notifications from 'expo-notifications';

function clickMe() {
  alert("You clicked me!");
}

export default function App() {
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  async function updatePermissionStatus() {
    // const { status: existingStatus } = await Notifications.getPermissionsAsync();

    const settings = await Notifications.getPermissionsAsync();
    const ios = settings.ios
    if (ios != null) {
      setIsAlertEnabled(ios.allowsAlert)
      setIsSoundEnabled(ios.setIsSoundEnabled)
    }
  }

  async function requestAlertsOnly() {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
      },
    })
    updatePermissionStatus()
}

  async function requestAlertsAndSound() {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowSound: true,
      },
    })
    updatePermissionStatus()
  }

  updatePermissionStatus()
  
  return (
    <View style={styles.container}>
      <Button onPress={updatePermissionStatus} title="Update Permission Status"/>
      <Button onPress={requestAlertsOnly} title="Request Alerts"/>
      <Button onPress={requestAlertsAndSound} title="Request Alerts & Sound"/>
      {isAlertEnabled ? <Text>Alerts are enabled</Text> : <Text>Alerts are not enabled</Text>}
      {isSoundEnabled ? <Text>Sound is enabled</Text> : <Text>Sound is not enabled</Text>}
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
