import React from "react";
import { Button, Text, Icon,  } from "native-base";
import { Ionicons } from "react-native-vector-icons";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["NativeBase:"]);

const FormIconButton = (props) => {
	return (
		<Button
			style={{ elevation: 8 }}
			borderRadius={props.buttonRadius}
			width={props.width}
			height={props.height}
			variant={props.variant}
			colorScheme={props.colorScheme}
			onPress={props.onPress}
			leftIcon={<Icon as={Ionicons} name={props.icon} size="5" />}
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

export default FormIconButton;
