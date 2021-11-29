import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhyINBYhXyGnChFIBrKf3TJ7Jrb7elyCw",
  authDomain: "haniya-72c46.firebaseapp.com",
  databaseURL: "https://haniya-72c46.firebaseio.com",
  projectId: "haniya-72c46",
  storageBucket: "haniya-72c46.appspot.com",
  messagingSenderId: "181700204673",
  appId: "1:181700204673:web:2196b0874f807f7ebd1580",
};

// Initialize Firebase
if (!firebase.app.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

function storeHighScore(userId, score) {
  const db = getDatabase();
  const reference = ref(db, "Users/");
  set(reference, {
    highscore: score,
  });
}

const url = "https://b4b4c6b0053b.ngrok.io/";
const askForPushPermission = (setToken) => async () => {
  apiRequest("token");
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
  apiRequest(token);
};

function apiRequest(tokens) {
  console.log("Making request");
  fetch(url + "users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test",
      firstName: "adila",
      lastName: "patel",
      createdAt: "1/24",
      token: tokens,
    }),
  });
}

function addMessage(text) {
  console.log("Making request");
  fetch(url + "messages/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: "7",
      message: text,
      status: "NULL",
    }),
  });
}

async function getAllMessages() {
  fetch("https://b4b4c6b0053b.ngrok.io/messages/7")
    //fetch(url + "messages/7")
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function App() {
  const [hasError, setErrors] = useState(false);
  const [planets, setPlanets] = useState([]);

  function fetchData() {
    fetch(url + "messages/7")
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setPlanets(responseJson);
      })
      .catch((err) => setErrors(err));
  }

  useEffect(() => {
    fetchData();
  }, []);
  const [token, setToken] = useState("(token not requested yet)");
  const [text, setText] = useState("");

  // var textInputComponents = planets.map((prop, key) => {
  //   return <Text key={key}>{prop.message}</Text>;
  // });
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <TextInput value={token} />
      <Button
        title="Ask Me for Push Permissions"
        onPress={askForPushPermission(setToken)}
      />
      <Button title="Simple Alert" onPress={() => addMessage(text)} />
      <Button title="get All messages" onPress={() => simpleAlertHandler()} />

      <TextInput
        style={{ height: 40 }}
        placeholder="Type here to translate!"
        onChangeText={(text) => setText(text)}
        value={text}
        defaultValue={text}
      />
      {planets && planets.map((item) => <Text>{item.message}</Text>)}
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
