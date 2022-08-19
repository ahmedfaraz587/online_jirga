import React, {useState, useContext, useEffect} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {View} from 'react-native'
import {Button,Text,TextInput} from 'react-native-paper';
import {
  buttonColor,
  buttonHeight,
  buttonWidth,
  buttonCornerRadius,
} from '../constants';

const VideoCallScreen = props => {
  const [channel, setChannel] = useState('');
  const [videoCall, setVideoCall] = useState(false);

  const connectionData = {
    appId: 'f0005ae1aad042afba5a21c899493a09',
    channel: channel,
  };

  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };

 function onCall(text){
  if(text.length > 0){
    setVideoCall(true)
  }
  else
  alert('Please enter Code')
  
 }

  return videoCall ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
  ) : (
    <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          alignSelf: 'center',
          marginBottom: 10,
        }}>
        Enter code to
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          alignSelf: 'center',
          marginBottom: 40,
        }}>
        Join Video Chat
      </Text>
      <TextInput
        placeholder="Enter Code"
        mode="outlined"
        value={channel}
        onChangeText={text => setChannel(text)}
      />
      <Button
        onPress={() => onCall(channel)}
        mode="contained"
        color={buttonColor}
        textColor="white"
        style={{
          borderRadius: buttonCornerRadius,
          marginTop: 15,
          height: 40,
          justifyContent: 'center',
          elevation: 10,
        }}>
        Join Call
      </Button>
      <Button
        onPress={() => props.navigation.goBack()}
        mode="contained"
        color='red'
        style={{
          borderRadius: buttonCornerRadius,
          marginTop: 15,
          height: 40,
          justifyContent: 'center',
          elevation: 10,
        }}>
        Back
      </Button>
    </View>
  );
};

export default VideoCallScreen;
