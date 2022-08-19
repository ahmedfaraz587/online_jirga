import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {backgroundColor} from '../constants';
import firebase from 'firebase';
import {UserInfoContext} from '../contexts/UserContext';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const ChatScreen = (props, {navigation}) => {
  const {uid} = useContext(UserInfoContext);
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    // getting all chat rooms
    firebase
      .firestore()
      .collection('UsersChated')
      .doc(uid)
      .onSnapshot(snapshot => {
        if (snapshot.data()) {
          const user = snapshot?.data()['persons'];
          setList(user);
          for (let x in user) {
            fetchData(user[x].id);
          }
        }
      });
  }, []);

  function fetchData(id) {
    firebase
      .firestore()
      .collection('Users')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          setUsers(prevUsers => [
            ...prevUsers,
            {
              name: doc.data().name,
              uid: doc.data().id,
              profilePicture: doc.data().profilePicture,
            },
          ]);
        }
      });
  }

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', width: '100%', marginBottom: 5}}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Chat Rooms
        </Text>
      </View>
      <Divider style={{marginBottom: 6, height: 1}} />
      <TouchableOpacity
        style={{width: '100%', padding: 5, justifyContent: 'center'}}
        onPress={() => props.navigation.navigate('Video')}>
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          Create Video Chat Room
        </Text>
      </TouchableOpacity>
      <Divider />
      <FlatList
        data={users}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Messages', {
                senderId: uid,
                receiverId: item.uid,
                name: item.name,
              })
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                margin: 1,
                padding: 5,
                backgroundColor: 'white',
                alignItems: 'center',
                height: 60,
              }}>
              <Image
                source={{uri: item.profilePicture}}
                style={{width: 45, height: 45, borderRadius: 24}}
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  marginLeft: 8,
                  color: 'black',
                }}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    padding: 10,
  },
});
