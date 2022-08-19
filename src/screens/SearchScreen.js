import React, { useState,useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	FlatList,
	Image,
	TouchableOpacity,
} from "react-native";
import { buttonColor } from "../constants";
import { backgroundColor } from "../constants";
import { Searchbar } from "react-native-paper";
import firebase from 'firebase';
import Foundation from 'react-native-vector-icons/Foundation';


const SearchScreen = ({navigation}) => {
	const [users, setUsers] = useState([]);
	useEffect(() => {
	}, [users]);
	

	const fetchUsers = (search) => {
		if(search.length <= 0 ){
			setUsers([])
			return;
		};
		firebase
			.firestore()
			.collection("Users")
			.orderBy('name')
			.startAt(search)
			.endAt(search + '\uf8ff')
			.get()
			.then((snapshot) => {
				let users = snapshot.docs.map((doc) => {
					const data = doc.data();
					return { ...data };
				});
				setUsers(users);
			});
	};

	return (
		<View style={styles.container}>
			<Searchbar
				style={{ borderRadius: 10, height: 45,marginBottom:5 }}
				placeholder="Search"
				onChangeText={(search) => fetchUsers(search)}
				
			/>
			<FlatList
				data={users}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile', {
                  userid: item.id,
                });
              }}>
              <View style={styles.flatlistContainer}>
                <Image
                  source={{uri: item.profilePicture}}
                  style={styles.image}
                />
                <Text style={{fontSize: 14}}>{item.name}</Text>
                {item.isJirgaMember ? (
                  <Foundation style={{alignSelf:'center',alignItems:'flex-end',flexDirection:'row'}} name="check" size={20} color={buttonColor} />
                ) : null}
              </View>
            </TouchableOpacity>
          );
				}}
			/>
		</View>
	);
};

export default SearchScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: backgroundColor,
		// marginTop: StatusBar.currentHeight,
		padding: 10
	},
	flatlistContainer: {
		flexDirection: "row",
		padding: 10,
		backgroundColor: "#fff",
		margin: 2,
		borderRadius: 10,
		alignItems:'center',
		width:'100%',
		flex:1
	},
	image: {
		width: 25,
		height: 25,
		borderRadius: 40,
		marginRight: 10,
	},
});
