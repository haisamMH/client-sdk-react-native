import React, { useState, useEffect } from 'react';

import { PermissionsAndroid } from 'react-native'
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PreJoinPage } from './PreJoinPage';
import { RoomPage } from './RoomPage';
import Toast from 'react-native-toast-message';
import RNCallKeep, {IOptions} from 'react-native-callkeep';

const Stack = createNativeStackNavigator();
export default function App() {

  useEffect(() => {
    setup()

    RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);

    return () => RNCallKeep.removeEventListener('didReceiveStartCallAction')
  }), []

  const didReceiveStartCallAction = (data: any) => {
    let { handle, callUUID, name } = data;
    console.log("didReceiveStartCallAction => ", handle)
  }

  const setup = () => {
    const options: IOptions = {
      ios: {
        appName: 'VinixLive',
        supportsVideo: true
      },
      android: {
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.CAMERA],
        alertTitle: 'Permissions Required',
        alertDescription:
          'This application needs to access your phone calling accounts to make calls',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'sim_icon'
      }
    };

    try {
      RNCallKeep.setup(options);
      RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
    } catch (err) {
      console.error('initializeCallKeep error');
    }
  }

  return (
    <>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen name="PreJoinPage" component={PreJoinPage} />
          <Stack.Screen name="RoomPage" component={RoomPage} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

export type RootStackParamList = {
  PreJoinPage: undefined;
  RoomPage: { url: string; token: string };
};
