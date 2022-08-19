import React, { useState } from "react";
import { NativeBaseProvider, Stack, Select, Box } from "native-base";
import { Image, StyleSheet, View,ToastAndroid } from "react-native";
import FormButton from "../components/FormButton";
import FormIconInput from "../components/FormIconInput";
import { logoImage } from "../constants/images";
import * as Animatable from "react-native-animatable";
import firebase from 'firebase'
import {
	backgroundColor,
	buttonColor,
	buttonCornerRadius,
	secondaryColor,
	buttonHeight,
	buttonWidth,
	inputContainerHeight,
} from "../constants";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisable, setPasswordVisable] = useState(true);
	// const [role, setRole] = useState();

	const onSignIn = () => {
		if (password.length > 0 && email.length > 0){
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          ToastAndroid.show('Login Succesfully', ToastAndroid.SHORT);
        })
        .catch(result => {
          alert(result);
        });
	}}


	return (
		<NativeBaseProvider>
			<Stack
				flex={1}
				alignItems="center"
				justifyContent="center"
				direction="column"
				style={styles.container}
			>
				<Stack style={styles.header}>
					<Image
						source={logoImage}
						style={{
							borderRadius: 120,
							height: 240,
							width: 240,
						}}
					/>
				</Stack>
				<Animatable.View animation="fadeInUpBig" style={styles.footer}>
					<Stack
						space={4}
						style={{
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<FormIconInput
							placeholder="Email"
							leftIcon="email"
							onChangeText={(e) => setEmail(e)}
							keyboardType="email-address"
							height={inputContainerHeight}
							value={email}
						/>
						<FormIconInput
							placeholder="Password"
							leftIcon="lock"
							onChangeText={(e) => setPassword(e)}
							secureTextEntry={passwordVisable}
							value={password}
							rightIcon="eye-off"
							passwordVisable={() =>
								setPasswordVisable(!passwordVisable)
							}
							height={inputContainerHeight}
						/>
						<FormButton
							buttonTitle="Sign In"
							color={buttonColor}
							borderRadius={buttonCornerRadius}
							height={buttonHeight}
							width={buttonWidth}
							onPress={onSignIn}
						/>
						<FormButton
							onPress={() => navigation.navigate("Signup")}
							buttonTitle="Sign Up"
							color={buttonColor}
							borderRadius={buttonCornerRadius}
							height={buttonHeight}
							width={buttonWidth}
						/>
					</Stack>
				</Animatable.View>
			</Stack>
		</NativeBaseProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: backgroundColor,
	},
	header: {
		flex: 1,
		paddingBottom: 0,
		alignItems: "center",
		justifyContent: "flex-end",
		marginTop: 90,
	},
	footer: {
		flex: 3,
		backgroundColor: secondaryColor,
		paddingTop: 50,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		elevation: 10,
	},
});

export default LoginScreen;
