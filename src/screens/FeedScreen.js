import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  ToastAndroid,
} from 'react-native';

import {backgroundColor, buttonColor, buttonCornerRadius} from '../constants';
import firebase from 'firebase';

import {FAB, Divider, Button} from 'react-native-paper';
import {profilePlaceholder} from '../constants/images';
import {NativeBaseProvider, Input, useSafeArea} from 'native-base';
import {UserInfoContext} from '../contexts/UserContext';

const FeedScreen = ({navigation}) => {
  const {uid, name, isJirgaMember, profilePicture} =
    useContext(UserInfoContext);
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {}, [comments]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('Posts')
      .orderBy('creationTime', 'desc')
      .onSnapshot(snapshot => {
        const newPosts = snapshot.docs.map(doc => ({
          post: doc.data().postText,
          name: doc.data().name,
          postId: doc.data().postId,
          date: doc.data().creationDate,
          time: doc.data().creationTime,
          id: doc.data().id,
        }));
        setPosts(newPosts);
        setCommentsList(newPosts);
      });
  }, []);

  //getting profile picture of every user
  useEffect(() => {
    firebase
      .firestore()
      .collection('Users')
      .onSnapshot(snapshot => {
        const newImage = snapshot.docs.map(doc => {
          if (doc.data().profilePicture !== null) {
            return {
              profilePicture: doc.data().profilePicture,
              id: doc.data().id,
            };
          }
        });
        setImage(newImage);
      });
  }, []);

  const setCommentsList = comnt => {
    if (comnt.length <= 0) return;
    const c = comnt.map(e => {
      return {
        pid: e.postId,
        comment: '',
      };
    });
    setComments(c);
  };
  useEffect(() => {}, [comments]);

  const handleComment = (id, n) => {
    for (let i = 0; i <= comments.length; i++) {
      if (comments[i] != undefined) {
        if (comments[i].pid === id) {
          if (comments[i].comment.length > 0) {
            let c = comments[i].comment;
            firebase
              .firestore()
              .collection('Comments')
              .doc(id.toString())
              .set(
                {
                  comment: firebase.firestore.FieldValue.arrayUnion({
                    text: c,
                    name: n,
                  }),
                },
                {merge: true},
              )
              .then(() => {
                setCommentsList(posts);
                ToastAndroid.show('Comment added', ToastAndroid.SHORT);
              });
          }
        }
      }
    }
  };

  function getImageUri(id) {
    for (let i = 0; i < image.length; i++) {
      if (image[i].id === id) {
        return image[i].profilePicture;
      }
    }
  }

  const gotoPostScreen = item => {
    navigation.navigate('Post', {
      postId: item.postId,
      name: item.name,
      image: getImageUri(item.id),
      id: item.id,
      postText: item.post,
      date: item.date,
      time: item.time,
    });
  };

  const commentValue = id => {
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].pid === id) {
        return comments[i].comment;
      }
    }
  };
  const commentValueChangeHandler = (text, id) => {
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].pid === id) {
        const com = comments[i];
        com.comment = text;
        setComments([...comments, com]);
      }
    }
  };

  function renderPost({item}) {
    return (
      <View style={styles.cardView}>
        <View style={styles.cardHeader}>
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 30 / 2,
              margin: 5,
            }}
            source={
              image.length > 0
                ? {
                    uri: getImageUri(item.id),
                  }
                : profilePlaceholder
            }
          />
          <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.name}</Text>
        </View>
        <Divider />
        <View style={styles.cardFooter}>
          <Text style={{fontSize: 16, marginBottom: 8}}>{item.post}</Text>
          <Divider />
          <Button
            mode="contained"
            color="grey"
            style={{marginBottom: 8}}
            dark
            labelStyle={{fontSize: 8}}
            onPress={() => gotoPostScreen(item)}>
            View comments
          </Button>
          {isJirgaMember ? (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: 5,
                marginBottom: 5,
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}>
              <Input
                p={2}
                paddingLeft={4}
                variant="rounded"
                placeholder="Comment..."
                value={commentValue(item.postId)}
                width="75%"
                onChangeText={text =>
                  commentValueChangeHandler(text, item.postId)
                }
              />
              <Button
                style={{
                  backgroundColor: buttonColor,
                  width: '24%',
                  borderRadius: buttonCornerRadius,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                dark
                uppercase={false}
                onPress={() => {
                  handleComment(item.postId, name);
                }}
                mode="contained"
                labelStyle={{fontSize: 15}}>
                send
              </Button>
            </View>
          ) : null}
          <Text style={{fontSize: 12, color: 'grey'}}>
            Date : {item.date} Time : {item.time}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={profilePicture ? {uri: profilePicture} : profilePlaceholder}
            style={{
              width: 37,
              margin: 6,
              height: 37,
              borderRadius: 37 / 2,
            }}
          />
          <Text style={{fontWeight: 'bold', fontSize: 20}}>{name}</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={item => item.postId}
          renderItem={renderPost}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          color="#ffff"
          onPress={() => {
            navigation.navigate('AddPost');
          }}
        />
      </View>
    </NativeBaseProvider>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    // marginTop: StatusBar.currentHeight,
    padding: 15,
  },
  header: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    height: 45,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#ffff',
    elevation: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: buttonColor,
  },
  cardView: {
    borderRadius: 10,
    backgroundColor: '#ffff',
    elevation: 5,
    marginBottom: 8,
    marginTop: 10,
  },
  postText: {
    fontSize: 20,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooter: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
