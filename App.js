import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

const askForPushPermission = (setToken) => async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  console.log("push notification status ", finalStatus);
  if (finalStatus !== "granted") {
    setToken(`(token ${finalStatus})`);
  }
  let token = await Notifications.getExpoPushTokenAsync();
  setToken(token);
};

export default function App() {
  const [token, setToken] = useState("(token not requested yet)");
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <TextInput value={token} />
      <Button
        title="Ask Me for Push Permissions"
        onPress={askForPushPermission(setToken)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
