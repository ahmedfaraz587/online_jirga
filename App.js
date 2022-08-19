import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import firebase from 'firebase/app';
import SplashScreen from './src/screens/SplashScreen';

const firebaseConfig = {
  apiKey: 'AIzaSyAFPEKChN7L2K5TSwqzuLce_OotU_xt9Jo',
  authDomain: 'onlinejirgasystem.firebaseapp.com',
  projectId: 'onlinejirgasystem',
  storageBucket: 'onlinejirgasystem.appspot.com',
  messagingSenderId: '779781944003',
  appId: '1:779781944003:web:b215c4daf6a4ec4e39e876',
  measurementId: 'G-NGL057JB1W',
};
let app = null;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
}
firebase.firestore().settings({experimentalForceLongPolling: true, merge:true });

import {LogBox} from 'react-native';

LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs([
  'Warning: Async Storage has been extracted from react-native core',
]);

export default function App({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
