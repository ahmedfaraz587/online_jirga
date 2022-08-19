import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  ToastAndroid,
} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import ImagePicker from 'react-native-image-crop-picker';
import {
  backgroundColor,
  inputContainerHeight,
  inputContainerRadius,
  buttonColor,
} from '../constants';
import firebase from 'firebase';
import {UserInfoContext} from '../contexts/UserContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Button,
  Divider,
  Menu,
  Provider,
  Modal,
  Portal,
  IconButton,
  TextInput,
} from 'react-native-paper';
import {profilePlaceholder} from '../constants/images';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const ProfileScreen = props => {
  const [hire, setHire] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState('');
  const {name, email, uid, profilePicture} = useContext(UserInfoContext);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    if(currentUser !== uid && userData?.isJirgaMember === true){
      firebase
      .firestore()
      .collection('Groups')
      .doc(currentUser)
      .onSnapshot(snapshot => {
        setUserData(snapshot.data());
      })
    }
  },[])

  let userName = name;
  const [updatedName, setUpdatedName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [visible, setVisible] = useState(false);
  const [postMenuVisible, setPostMenuVisible] = useState([]);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const modalContainerStyle = {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  };

  useEffect(() => {
    let isMounted = true;
    if (props.route.params !== undefined) {
      if (isMounted) setCurrentUser(props.route.params.userid);
    } else {
      if (isMounted) setCurrentUser(uid);
    }
    return () => {
      isMounted = false;
    };
  }, [props.route.params]);

  useEffect(() => {
    let isMounted = true;
    firebase
      .firestore()
      .collection('Users')
      .where('id', '==', currentUser)
      .onSnapshot(snapshot => {
        snapshot.docs.map(doc => {
          if (isMounted) setUserData(doc.data());
        });
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    firebase
      .firestore()
      .collection('Posts')
      .where('id', '==', currentUser)
      .onSnapshot(snapshot => {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.data().id,
          post: doc.data().postText,
          date: doc.data().creationDate,
          time: doc.data().creationTime,
          name: doc.data().name,
          postId: doc.data().postId,
        }));
        if (isMounted) setPosts(newPosts);
        if (isMounted) visibility(newPosts);
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {}, [postMenuVisible]);

  //function to add id and isVisible in new array
  const visibility = posts => {
    const p = posts.map(post => {
      return {
        // ...post,
        postId: post.postId,
        isVisible: false,
      };
    });
    setPostMenuVisible(p);
  };

  const getIsVisible = id => {
    for (let i = 0; i < postMenuVisible.length; i++) {
      if (postMenuVisible[i].postId === id) {
        return postMenuVisible[i].isVisible;
      }
    }
  };

  function pickImage() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then(image => {
      setImage(image.path);
      if (image) uploadImage();
      ToastAndroid.show('Image Uploaded', ToastAndroid.SHORT);
    });
  }
  //function to upload image to firebase
  const uploadImage = async () => {
    const response = await fetch(image);
    const childPath = `${currentUser}/${Math.random().toString(36)}`; //random string to avoid duplicate image name
    const blob = await response.blob(); //convert the response to blob

    await firebase
      .storage()
      .ref(childPath)
      .put(blob)
      .then(e => e.ref.getDownloadURL())
      .then(url => {
        if (url !== null && url !== undefined) {
          firebase.firestore().collection('Users').doc(currentUser).update({
            profilePicture: url,
          });
          alert('stored');
        }
      })
      .then(() => setImage(''))
      .catch(e => alert(e));
  };

  const isActiveSetter = (id, isActive) => {
    let postMenuPost = null;
    for (let i = 0; i < postMenuVisible.length; i++) {
      if (postMenuVisible[i].postId == id) {
        postMenuPost = postMenuVisible[i];
        postMenuPost.isVisible = isActive;
      }
    }

    setPostMenuVisible([...postMenuVisible, postMenuPost]);
  };

  const onDelete = id => {
    let pid = id.toString();
    firebase.firestore().collection('Posts').doc(pid).delete();
  };

  const gotoPostScreen = item => {
    props.navigation.navigate('Post', {
      postId: item.postId,
      name: item.name,
      image: profilePicture,
      id: item.id,
      postText: item.post,
      date: item.date,
      time: item.time,
    });
  };

  const updateName = name => {
    if (name.length > 0 && name !== userName) {
      firebase
        .firestore()
        .collection('Users')
        .doc(currentUser)
        .update({
          name: name,
        })
        .then(() => {
          setModalVisible(false);
          ToastAndroid.show('User name is updated', ToastAndroid.SHORT);
        });
    } else if (name === name) {
      ToastAndroid.show('Please change your name', ToastAndroid.SHORT);
    }
  };

  function hirePressed() {
    //hire selected user for jirga and store in firebase firestore collection groups
    setHire(true)
    if (hire) {
      firebase
        .firestore()
        .collection('JirgaGroups')
        .doc(currentUser)
        .set(
          {
            users: firebase.firestore.FieldValue.arrayUnion({
              id: uid,
              hired: true
            }),
          },
          {merge: true},
        )
        .then(() => {
          firebase.firestore().collection('UserGroups').doc(uid).collection('IsHired').doc(currentUser).set({
            hired: true,
          });
        })
      ToastAndroid.show('You are hired for jirga', ToastAndroid.SHORT);
    }
  }

  function renderPost({item}) {
    return (
      <View style={styles.cardView}>
        <View style={styles.cardHeader}>
          <Image
            source={
              currentUser === uid
                ? profilePicture
                  ? {uri: profilePicture}
                  : profilePlaceholder
                : {uri: userData.profilePicture}
            }
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              margin: 7,
            }}
          />
          <Text style={{fontWeight: 'bold', fontSize: 15}}>{item.name}</Text>
          {currentUser === uid ? (
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Menu
                style={{paddingTop: 34, paddingRight: 28}}
                visible={getIsVisible(item.postId)}
                onDismiss={() => isActiveSetter(item.postId, false)}
                anchor={
                  <IconButton
                    onPress={() => isActiveSetter(item.postId, true)}
                    icon="dots-vertical"
                  />
                }>
                <Menu.Item
                  style={{height: 30, width: 145}}
                  onPress={() => onDelete(item.postId)}
                  title="Delete"
                  icon="delete"
                />
              </Menu>
            </View>
          ) : null}
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

          <Text style={{fontSize: 12, color: 'grey'}}>
            Date : {item.date} Time : {item.time}
          </Text>
        </View>
      </View>
    );
  }

  if (userData) {
    return (
      <Provider>
        <View style={styles.container}>
          <View
            style={
              currentUser !== uid
                ? {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }
                : {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }
            }>
            {currentUser !== uid ? (
              <TouchableOpacity
                onPress={() => {
                  setCurrentUser(uid);
                }}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Switch to main 🔄
                </Text>
              </TouchableOpacity>
            ) : null}
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  color="black"
                  onPress={openMenu}
                />
              }>
              {/* {userData.isJirgaMember ? (
                <Menu.Item title="Pending Requests" onPress={() => {}} />
              ) : (
                <Menu.Item title="Requested Jirga's" onPress={() => {}} />
              )} */}
              <Menu.Item
                style={{height: 30, width: 145}}
                onPress={() => firebase.auth().signOut()}
                title="Logout"
                icon="logout"
              />
            </Menu>
          </View>

          <View style={styles.imageContainer}>
            <View
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                elevation: 15,
                marginBottom: 10,
              }}>
              <Image
                resizeMode="cover"
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                }}
                source={
                  currentUser === uid
                    ? profilePicture
                      ? {uri: profilePicture}
                      : profilePlaceholder
                    : {uri: userData.profilePicture}
                }
              />
            </View>
            {currentUser === uid ? (
              <Button
                icon="image"
                mode="contained"
                style={{borderRadius: 10, marginRight: 10}}
                color={buttonColor}
                onPress={pickImage}>
                Edit Profile
              </Button>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Button
                  icon="send-circle"
                  mode="contained"
                  style={{borderRadius: 10, marginRight: 15}}
                  color={buttonColor}
                  dark
                  onPress={() =>
                    props.navigation.navigate('Messages', {
                      senderId: uid,
                      receiverId: currentUser,
                      name: userData.name,
                    })
                  }>
                  Chat
                </Button>
                <Button
                  onPress={() => hirePressed()}
                  icon={require('../assets/search.png')}
                  mode="contained"
                  dark
                  style={{borderRadius: 10}}
                  color={buttonColor}>
                  {!hire ? <Text>Hire</Text> : <Text>hired</Text>}
                </Button>
              </View>
            )}
          </View>
          <View style={{marginBottom: 20}}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>Name</Text>
              <Portal>
                <Modal
                  visible={modalVisible}
                  onDismiss={() => setModalVisible(false)}
                  contentContainerStyle={modalContainerStyle}>
                  <View>
                    <TextInput
                      placeholder="Enter Your Name"
                      mode="outlined"
                      style={{
                        marginBottom: 10,
                        height: 50,
                      }}
                      onChangeText={text => setUpdatedName(text)}
                    />
                    <Button
                      mode="contained"
                      style={{
                        backgroundColor: buttonColor,
                      }}
                      onPress={() => updateName(updatedName)}>
                      Update
                    </Button>
                  </View>
                </Modal>
              </Portal>
              <Text style={styles.nameInput}>{userData.name}</Text>
              {userData.isJirgaMember ? (
                <Foundation name="check" size={20} color={buttonColor} />
              ) : null}
              {currentUser == uid ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setModalVisible(true)}>
                  <FontAwesome name="pencil" size={20} color="black" />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>Email</Text>
              <Text style={styles.nameText2}>{userData.email}</Text>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            data={posts}
            keyExtractor={item => item.postId}
            renderItem={renderPost}
          />
        </View>
      </Provider>
    );
  } else return null;
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    // marginTop: StatusBar.currentHeight,
    padding: 10,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    height: inputContainerHeight,
    flexDirection: 'row',
    borderRadius: inputContainerRadius,
    backgroundColor: '#ffff',
    elevation: 5,
    padding: 10,
    marginRight: 3,
    marginLeft: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 17,
  },
  nameInput: {
    fontSize: 17,
    marginLeft: 25,
    marginRight: 10,
  },
  nameText2: {
    fontSize: 17,
    marginLeft: 25,
  },
  iconContainer: {
    fontSize: 20,
    marginLeft: 'auto',
  },
  cardView: {
    borderRadius: 10,
    backgroundColor: '#ffff',
    elevation: 5,
    marginBottom: 8,
    marginTop: 8,
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
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
