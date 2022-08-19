import React from "react";
import { Input, Icon, } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity ,View,TextInput } from "react-native";
import { windowWidth } from "../constants/dimension";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["NativeBase:"]);

const FormIconInput = (props) => {
	return (
    <View style={{elevation: 10, width: windowWidth, alignItems: 'center'}}>
      <Input
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        borderRadius={props.borderRadius}
        variant="rounded"
        borderWidth={0}
        fontSize={18}
        keyboardType={props.keyboardType}
        backgroundColor="white"
        width="90%"
        height={props.height}
        secureTextEntry={props.secureTextEntry}
        InputLeftElement={
          <Icon
            as={MaterialIcons}
            name={props.leftIcon}
            size={6}
            ml="3"
          />
        }
        InputRightElement={
          <TouchableOpacity onPress={props.passwordVisable}>
            <Icon as={Ionicons} name={props.rightIcon} size={5} mr="3" />
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default FormIconInput;