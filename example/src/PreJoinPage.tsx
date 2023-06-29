import * as React from 'react';
import { useState, useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StyleSheet, View, TextInput, Text, Button, Alert } from 'react-native';
import type { RootStackParamList } from './App';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
const DEFAULT_URL = 'wss://vinix-meet-np7o2s4i.livekit.cloud';
const DEFAULT_TOKEN = '';

const URL_KEY = 'url';
const TOKEN_KEY = 'token';

export const PreJoinPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'PreJoinPage'>) => {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   AsyncStorage.getItem(URL_KEY).then((value) => {
  //     if (value) {
  //       setUrl(value);
  //     }
  //   });

  //   AsyncStorage.getItem(TOKEN_KEY).then((value) => {
  //     if (value) {
  //       setToken(value);
  //     }
  //   });
  // }, []);

  const getLiveKitToken = () => {
    if (roomName && participantName) {
      setLoading(true)
      fetch(`https://kok028u4qf.execute-api.us-east-1.amazonaws.com/api2/getLivekitToken?roomName=${roomName}&participantName=${participantName}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.token) {
            let callUUID = uuid.v4()
            setToken(data.token);
            setLoading(false)
            RNCallKeep.startCall(
              callUUID,
              roomName,
              participantName,
              "generic",
              true,
            );
            navigation.push('RoomPage', { url: url, token: data.token, callUUID });
          }
        }).catch(e => {
          setLoading(false)
          Alert.alert(
            "Error",
            "Please try later!"
          );
        });
    }
  }

  const handleRoomName = (value: string) => {
    console.log(value)
    setRoomName(value.toLowerCase())
  }

  const { colors } = useTheme();

  let saveValues = (saveUrl: string, saveToken: string) => {
    AsyncStorage.setItem(URL_KEY, saveUrl);
    AsyncStorage.setItem(TOKEN_KEY, saveToken);
  };
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>Room Name</Text>
      <TextInput
        style={{
          color: colors.text,
          borderColor: colors.border,
          ...styles.input,
        }}
        onChangeText={handleRoomName}
        value={roomName}
      />

      <Text style={{ color: colors.text }}>Participant Name</Text>
      <TextInput
        style={{
          color: colors.text,
          borderColor: colors.border,
          ...styles.input,
        }}
        onChangeText={setParticipantName}
        value={participantName}
      />

      <Button
        title="Connect"
        onPress={getLiveKitToken}
      />

      <View style={styles.spacer} />

      {/* <Button
        title="Save Values"
        onPress={() => {
          saveValues(url, token);
        }}
      />

      <View style={styles.spacer} />

      <Button
        title="Reset Values"
        onPress={() => {
          saveValues(DEFAULT_URL, DEFAULT_TOKEN);
          setUrl(DEFAULT_URL);
          setToken(DEFAULT_TOKEN);
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  spacer: {
    height: 10,
  },
});
