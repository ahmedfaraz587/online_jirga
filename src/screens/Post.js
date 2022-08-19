import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text, Divider} from 'react-native-paper';
import {backgroundColor} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';


const Post = ({navigation,route}) => {
  const doc = route.params.postId.toString();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    //get comments
    firebase
      .firestore()
      .collection('Comments')
      .doc(doc)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          setComments(snapshot.data()['comment']);
        }
        // }
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: '17%',
          }}
          onPress={() => navigation.goBack()}>
          <Ionicons name="caret-back" size={20} color="black" />
          <Text style={{fontWeight: 'bold', fontSize: 20}}>Back</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            alignSelf: 'center',
            marginLeft: 30,
          }}>
          Post
        </Text>
      </View>
      <Divider style={{height: 1}} />
      <View style={styles.cardView}>
        <View style={styles.cardHeader}>
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 30 / 2,
              margin: 5,
            }}
            source={{uri: route.params.image}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 15}}>
            {route.params.name}
          </Text>
        </View>
        <Divider />
        <View style={styles.cardFooter}>
          <Text style={{fontSize: 16, marginBottom: 8}}>
            {route.params.postText}
          </Text>
          <Divider />
          <Text style={{fontSize: 12, color: 'grey'}}>
            Date : {route.params.date} Time : {route.params.time}
          </Text>
          <Divider />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              marginTop: 12,
              marginBottom: 2,
            }}>
            Comments:
          </Text>
          {comments.length > 0 ? (
            comments.map((comment, index) => {
              return (
                <View key={index} style={styles.commentView}>
                  <Text style={{fontSize: 15, color: 'black'}}>
                    {comment.name} : {comment.text}
                  </Text>
                  <Divider />
                </View>
              );
            })
          ) : (
            <Text style={{fontSize: 15, color: 'grey'}}>No Comments</Text>
          )}
        </View>
      </View>
    </View>
  );
          }
export default Post;

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
  cardView: {
    borderRadius: 10,
    backgroundColor: '#ffff',
    elevation: 5,
    marginBottom: 8,
    marginTop: 10,
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
  commentView: {
    padding: 3,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});