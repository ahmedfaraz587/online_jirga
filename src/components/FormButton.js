import React from "react";
import { Button, Text } from "native-base";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["NativeBase:"]);

const FormButton = (props) => {
	return (
		<Button
		style={{elevation:8}}
			borderRadius={props.borderRadius}
			width={props.width}
			height={props.height}
			variant={props.variant}
			colorScheme={props.color}
			onPress={props.onPress}
			_text={{
				fontWeight: "bold",
				fontSize: "xl",
				color: "white",
			}}
		>
			{props.buttonTitle}
		</Button>
	);
};

export default FormButton;
