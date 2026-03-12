import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
FlatList,
Image,
TouchableOpacity,
ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../api/api";
import Icon from "react-native-vector-icons/Ionicons";

const AllChatsScreen = ({ navigation }: any) => {

const [users,setUsers] = useState([]);
const [loading,setLoading] = useState(true);
const [currentUserId,setCurrentUserId] = useState(null);
const [activeTab,setActiveTab] = useState("regular"); // regular / seller

useEffect(()=>{
 getCurrentUserId();
},[]);

const getCurrentUserId = async ()=>{

 const id = await AsyncStorage.getItem("userId");
 setCurrentUserId(id);

 fetchUsers(id);
};

const fetchUsers = async (userId)=>{

 try{

  const token = await AsyncStorage.getItem("token");

  const res = await API.get("/auth/users",{
   headers:{ Authorization:`Bearer ${token}` }
  });

  const users = res.data.users || [];

  const filtered = users.filter(u => u._id !== userId);

  setUsers(filtered);

 }catch(err){

  console.log("Chats Error:",err);

 }finally{

  setLoading(false);

 }

};

const renderChat = ({item})=>{

 return(

 <TouchableOpacity
 style={styles.chatCard}
 onPress={()=>navigation.navigate("ChatScreen",{ userId:item._id })}
 >

 <View style={styles.avatarContainer}>

 <Image
 source={{
 uri:item.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
 }}
 style={styles.avatar}
 />

 <View style={styles.onlineDot}/>

 </View>

 <View style={styles.chatInfo}>

 <Text style={styles.username}>
 {item.username}
 </Text>

 <Text style={styles.lastMessage} numberOfLines={1}>
 Tap to start conversation
 </Text>

 </View>

 <Icon name="chevron-forward-outline" size={20} color="#aaa"/>

 </TouchableOpacity>

 );

};

if(loading){

 return(

 <View style={styles.center}>
 <ActivityIndicator size="large"/>
 </View>

 );

}

return(

<View style={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<Text style={styles.headerTitle}>
Chats
</Text>

<View style={{flexDirection:"row"}}>

<TouchableOpacity
style={{marginRight:15}}
onPress={()=>navigation.navigate("CreateGroupScreen")}
>
<Icon name="people-outline" size={24}/>
</TouchableOpacity>

<TouchableOpacity
onPress={()=>navigation.navigate("Search")}
>
<Icon name="search-outline" size={24}/>
</TouchableOpacity>

</View>

</View>

{/* TABS */}

<View style={styles.tabs}>

<TouchableOpacity
style={[
styles.tab,
activeTab === "regular" && styles.activeTab
]}
onPress={()=>setActiveTab("regular")}
>
<Text style={[
styles.tabText,
activeTab === "regular" && styles.activeTabText
]}>
Regular Chats
</Text>
</TouchableOpacity>

<TouchableOpacity
style={[
styles.tab,
activeTab === "seller" && styles.activeTab
]}
onPress={()=>setActiveTab("seller")}
>
<Text style={[
styles.tabText,
activeTab === "seller" && styles.activeTabText
]}>
Seller Chats
</Text>
</TouchableOpacity>

</View>

{/* CHAT LIST */}

<FlatList
data={users}
keyExtractor={(item)=>item._id}
renderItem={renderChat}
showsVerticalScrollIndicator={false}
/>

{/* CREATE GROUP FLOAT BUTTON */}

<TouchableOpacity
style={styles.groupButton}
onPress={()=>navigation.navigate("CreateGroupScreen")}
>

<Icon name="people" size={24} color="#fff"/>

</TouchableOpacity>

</View>

);

};

export default AllChatsScreen;

const styles = StyleSheet.create({

container:{
 flex:1,
 backgroundColor:"#fff",
 paddingTop:50
},

header:{
 flexDirection:"row",
 justifyContent:"space-between",
 alignItems:"center",
 paddingHorizontal:18,
 marginBottom:10,
 paddingBottom: 20,
},

headerTitle:{
 fontSize:24,
 fontWeight:"bold"
},

tabs:{
 flexDirection:"row",
 marginHorizontal:15,
 marginBottom:10,
 backgroundColor:"#f2f2f2",
 borderRadius:10
},

tab:{
 flex:1,
 paddingVertical:10,
 alignItems:"center",
 borderRadius:10
},

activeTab:{
 backgroundColor:"#7b3fe4"
},

tabText:{
 fontSize:14,
 color:"#555"
},

activeTabText:{
 color:"#fff",
 fontWeight:"600"
},

chatCard:{
 flexDirection:"row",
 alignItems:"center",
 padding:15,
 borderBottomWidth:1,
 borderColor:"#eee"
},

avatarContainer:{
 position:"relative",
 marginRight:15
},

avatar:{
 width:55,
 height:55,
 borderRadius:28
},

onlineDot:{
 width:12,
 height:12,
 borderRadius:6,
 backgroundColor:"#22c55e",
 position:"absolute",
 bottom:2,
 right:2,
 borderWidth:2,
 borderColor:"#fff"
},

chatInfo:{
 flex:1
},

username:{
 fontSize:16,
 fontWeight:"600"
},

lastMessage:{
 color:"#777",
 marginTop:3,
 fontSize:13
},

groupButton:{
 position:"absolute",
 bottom:25,
 right:25,
 backgroundColor:"#7b3fe4",
 width:55,
 height:55,
 borderRadius:28,
 justifyContent:"center",
 alignItems:"center",
 elevation:4
},

center:{
 flex:1,
 justifyContent:"center",
 alignItems:"center"
}

});