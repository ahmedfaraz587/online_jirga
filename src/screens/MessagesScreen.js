import React, {useState, useEffect} from 'react';
import firebase from 'firebase';

import {GiftedChat} from 'react-native-gifted-chat';
import {Text, Divider} from 'react-native-paper';
import {backgroundColor} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet, View, TouchableOpacity, StatusBar} from 'react-native';
import {UserInfoContext} from '../contexts/UserContext';

const MessagesScreen = (props, {navigation}) => {
  const {callChecker} = React.useContext(UserInfoContext);
  const [messages, setMessages] = useState([]);
  const {senderId, receiverId, name} = props.route.params;
  const id =
    senderId > receiverId ? senderId + receiverId : receiverId + senderId;

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    let isMounted = true;
    const id =
      senderId > receiverId ? senderId + receiverId : receiverId + senderId;

    await firebase
      .firestore()
      .collection('ChatRooms')
      .doc(id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(snap => {
          return {
            ...snap.data(),
            createdAt: snap.data().createdAt.toDate(),
          };
        });
        if (isMounted) setMessages(msgs);
      });

    return () => {
      isMounted = false;
    };
  };

  const onSend = messageArray => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      senderId: senderId,
      receiverId: receiverId,
      createdAt: new Date(),
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    // send messages to firebase

    firebase
      .firestore()
      .collection('ChatRooms')
      .doc(id)
      .collection('Messages')
      .add({
        ...mymsg,
      })
      .then(
        firebase
          .firestore()
          .collection('UsersChated')
          .doc(senderId)
          .set(
            {
              persons: firebase.firestore.FieldValue.arrayUnion({
                id: receiverId,
              }),
            },
            {merge: true},
          ),
      )
      .then(
        firebase
          .firestore()
          .collection('UsersChated')
          .doc(receiverId)
          .set(
            {
              persons: firebase.firestore.FieldValue.arrayUnion({
                id: senderId,
              }),
            },
            {merge: true},
          ),
      )
      .catch(error => console.log(error));
  };

  useEffect(() => {}, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: '17%',
          }}
          onPress={() => props.navigation.navigate('Chat')}>
          <Ionicons name="caret-back" size={20} color="black" />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Back</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'center',
          }}>
          {name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            margin: 10,
          }}>
          <TouchableOpacity style={{alignItems: 'flex-end', marginRight: 20}}>
            <Ionicons name="call" size={23} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Video', (channelId = receiverId))
            }>
            <Ionicons name="videocam" size={25} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
      <Divider style={{height: 1}} />
      <View style={styles.chatView}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: senderId,
          }}
        />
      </View>
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    // marginTop: StatusBar.currentHeight,
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chatView: {
    flex: 1,
    backgroundColor: backgroundColor,
    marginTop: 10,
    marginBottom: 10,
  },
});
