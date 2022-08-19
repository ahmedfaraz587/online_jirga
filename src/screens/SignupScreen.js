import React, {useState} from 'react';
import FormButton from '../components/FormButton';
import FormIconInput from '../components/FormIconInput';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import firebase from 'firebase';

import {
  NativeBaseProvider,
  Stack,
  Heading,
  Center,
  Box,
  Select,
} from 'native-base';
import {
  backgroundColor,
  buttonColor,
  buttonCornerRadius,
  inputContainerRadius,
  secondaryColor,
  buttonHeight,
  buttonWidth,
  inputContainerHeight,
  inputContainerWidth,
} from '../constants';
import {profilePlaceholder} from '../constants/images';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [passwordVisable, setPasswordVisable] = useState(true);
  const [confirmPasswordVisable, setConfirmPasswordVisable] = useState(true);
  const [role, setRole] = useState();

  const signUp = () => {
    if (
      password === confirmPassword &&
      password.length > 0 &&
      name.length > 0 &&
      email.length > 0
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          firebase
            .firestore()
            .collection('Users')
            .doc(firebase.auth().currentUser.uid)
            .set({
              name: name,
              isJirgaMember: role,
              email: email,
              profilePicture: '',
              id: firebase.auth().currentUser.uid,
            });
        })
        .then(() => {
          ToastAndroid.show('Account has been created', ToastAndroid.SHORT);
        })
        .catch(e => {
          alert(e);
        });
    } else {
      alert('Please make sure that all the entries are correct');
    }
  };

  return (
    <NativeBaseProvider>
      <Stack
        flex={1}
        justifyContent="center"
        direction="column"
        style={styles.container}>
        <View style={styles.header}>
          <Center>
            <Heading>Create new Account!</Heading>
          </Center>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <Stack
            space={4}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FormIconInput
              placeholder="Name"
              leftIcon="person"
              onChangeText={e => setName(e)}
              value={name}
            />
            <FormIconInput
              placeholder="Email"
              leftIcon="email"
              onChangeText={e => setEmail(e)}
              keyboardType="email-address"
              value={email}
            />
            <FormIconInput
              placeholder="Password"
              value={password}
              leftIcon="lock"
              onChangeText={e => setPassword(e)}
              rightIcon="eye-off"
              secureTextEntry={passwordVisable}
              passwordVisable={() => setPasswordVisable(!passwordVisable)}
            />
            <FormIconInput
              placeholder="Confirm Password"
              leftIcon="lock"
              onChangeText={e => setConfirmPassword(e)}
              value={confirmPassword}
              rightIcon="eye-off"
              secureTextEntry={confirmPasswordVisable}
              passwordVisable={() =>
                setConfirmPasswordVisable(!confirmPasswordVisable)
              }
            />
            <Box
              style={{
                elevation: 0,
                width: inputContainerWidth,
              }}>
              <Select
                style={{
                  marginLeft: 10,
                }}
                borderRadius={inputContainerRadius}
                backgroundColor="white"
                selectedValue={role}
                minWidth="100%"
                borderWidth={0}
                accessibilityLabel="Select your role"
                placeholder="Select your role"
                _selectedItem={{
                  bg: 'teal.600',
                }}
                onValueChange={itemValue => setRole(itemValue)}>
                <Select.Item label="User" value={false} />
                <Select.Item label="Girga Member" value={true} />
              </Select>
            </Box>
            <FormButton
              buttonTitle="Sign Up"
              width={buttonWidth}
              height={buttonHeight}
              borderRadius={buttonCornerRadius}
              backgroundColor={buttonColor}
              color={buttonColor}
              onPress={signUp}
            />
          </Stack>
          <View
            style={{
              marginTop: 10,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              paddingRight: 23,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'red',
                  fontSize: 15,
                  textDecorationLine: 'underline',
                }}>
                Have account? Click here
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </Stack>
    </NativeBaseProvider>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
  },
  header: {
    flex: 1,
    paddingBottom: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 50,
  },
  footer: {
    flex: 5,
    backgroundColor: secondaryColor,
    paddingTop: 50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
  },
});
