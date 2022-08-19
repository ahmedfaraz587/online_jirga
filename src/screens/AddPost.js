import React, { useState, useCallback, useContext } from "react";
import uuid from "react-native-uuid";
import {
	Text,
	View,
	StyleSheet,
	StatusBar,
	TouchableWithoutFeedback,
	TouchableOpacity,
	KeyboardAvoidingView,
	Keyboard,
	Alert,
	ToastAndroid,
} from "react-native";
import { backgroundColor, buttonColor } from "../constants";
import { TextInput, Button, Divider } from "react-native-paper";
import  Ionicons  from "react-native-vector-icons/Ionicons";
import firebase from 'firebase';

import { UserInfoContext } from "../contexts/UserContext";
uuid
const AddPost = ({ navigation }) => {
	const [text, setText] = useState("");
	const { uid, name } = useContext(UserInfoContext);
	var postId =  Math.random().toString(36).slice(2);

	var date = new Date().getDate(); //To get the Current Date
	var month = new Date().getMonth() + 1; //To get the Current Month
	var year = new Date().getFullYear(); //To get the Current Year
	var hours = new Date().getHours(); //To get the Current Hours
	var min = new Date().getMinutes(); //To get the Current Minutes
	var sec = new Date().getSeconds(); //To get the Current Seconds

	var currentDate = date + "/" + month + "/" + year;
	var currentTime = hours + ":" + min + ':' + sec;
	
	

	const savePostData = () => {
		if (text.length > 0) {
			firebase
				.firestore()
				.collection("Posts")
				.doc(postId)
				.set({
					name: name,
					creationDate: currentDate,
					creationTime: currentTime,
					postText: text,
					id: uid,
					postId: postId,
				})
				.then(() => {
					ToastAndroid.show('Post added', ToastAndroid.SHORT)
					setText("");
				})
				.catch((error) => {
					alert(error.message);
				});
		} else {
			Alert.alert("Please enter text");
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View>
					<View style={styles.header}>
						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginRight: "20%",
							}}
							onPress={() => navigation.goBack()}
						>
							<Ionicons
								name="caret-back"
								size={20}
								color="black"
							/>
							<Text style={{ fontWeight: "bold", fontSize: 20 }}>
								Back
							</Text>
						</TouchableOpacity>
						<Text
							style={{
								fontWeight: "bold",
								fontSize: 20,
								alignSelf: "center",
							}}
						>
							New Post
						</Text>
					</View>
					<Divider style={{height:1}} />
					<View style={styles.inputContainer}>
						<TextInput
							label="Add Post"
							placeholder="Type something..."
							value={text}
							onChangeText={(text) => setText(text)}
							numberOfLines={15}
							multiline
							mode="outlined"
							style={{
								backgroundColor: "#ffff",
							}}
						/>
						<View
							style={{
								flexDirection: "row",
								marginTop: 10,
								justifyContent: "flex-end",
							}}
						>
							<Button
								icon="send"
								mode="contained"
								onPress={savePostData}
								style={{
									backgroundColor: buttonColor,
									borderRadius: 8,
								}}
							>
								Publish
							</Button>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default AddPost;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: backgroundColor,
		// marginTop: StatusBar.currentHeight,
		padding: 10,
	},
	header: {
		justifyContent: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	inputContainer: {
		marginTop: 10,
		padding: 10,
	},
});
