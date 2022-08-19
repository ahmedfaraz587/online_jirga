import React,{useEffect} from "react";
import { View, Image, Text } from "react-native";
import { backgroundColor } from "../constants";
import { logoImage } from "../constants/images";

const SplashScreen = ({ navigation }) => {
	useEffect(() => {
		setTimeout(() => {
			if(navigation != undefined)
			navigation.navigate('Login')
		}, 3000);
	}, []);

	function fun() {
		navigation.navigate("Login");
	}
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: backgroundColor,
			}}
		>
			<Image
				source={logoImage}
				style={{
					width: 240,
					height: 240,
					borderRadius: 120,
					marginBottom: 30,
				}}
			/>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text
					style={{
						fontSize: 30,
						fontWeight: "bold",
						color: "#000",
					}}
				>
					Welcome to
				</Text>
				<Text
					style={{
						fontSize: 30,
						fontWeight: "bold",
						color: "#000",
					}}
				>
					Online
				</Text>
				<Text
					style={{
						fontSize: 30,
						fontWeight: "bold",
						color: "#000",
					}}
				>
					Jirga Application
				</Text>
			</View>
		</View>
	);
};

export default SplashScreen;
