import React, {useState, useEffect} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import FeedScreen from '../screens/FeedScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Post from '../screens/Post';
import AddPost from '../screens/AddPost';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {primaryColor, inactiveColor} from '../constants';
import firebase from 'firebase';
import {UserInfoContext} from '../contexts/UserContext';
import MessagesScreen from '../screens/MessagesScreen';
import VideoCall from '../screens/VideoCallScreen';
import MakeGroup from '../screens/MakeGroup';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AppStack = (props) => {
  const uid = firebase.auth().currentUser.uid;
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const [isJirgaMember, setIsJirgaMember] = useState();

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection('Users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.data() != undefined) {
          setName(documentSnapshot.data().name);
          setEmail(documentSnapshot.data().email);
          setProfilePicture(documentSnapshot.data().profilePicture);
          setIsJirgaMember(documentSnapshot.data().isJirgaMember);
        }
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);


  return (
    <UserInfoContext.Provider
      value={{
        uid,
        name,
        email,
        isJirgaMember,
        profilePicture,
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{
            title: 'Add Post',
            headerStyle: {
              backgroundColor: 'black',
            },
          }}
        />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Video" component={VideoCall} />
        {/* <Stack.Screen name="AttendCall" component={AttendScreen} /> */}
        <Stack.Screen name="MakeGroup" component={MakeGroup} />
        <Stack.Screen name="Post" component={Post} />
      </Stack.Navigator>
    </UserInfoContext.Provider>
  );
};

function Home() {
  return (
    <Tab.Navigator
      activeColor={primaryColor}
      inactiveColor={inactiveColor}
      barStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="home" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="home" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome name="search" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome name="user" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppStack;
