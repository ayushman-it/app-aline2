import React, { useEffect, useState } from "react";

import {
 View,
 Text,
 StyleSheet,
 Image,
 TouchableOpacity,
 FlatList,
 ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { Modal } from "react-native";
import { API } from "../api/api";


const ProfileScreen = ({navigation}: any) => {

 const [user, setUser] = useState(null);
 const [posts, setPosts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState("posts");
 const [menuVisible, setMenuVisible] = useState(false);

 useEffect(() => {
  fetchProfile();
 }, []);

 const fetchProfile = async () => {

  try {

   const token = await AsyncStorage.getItem("token");

   const res = await API.get("/auth/profile", {
    headers: {
     Authorization: `Bearer ${token}`
    }
   });

   console.log("PROFILE DATA:", res.data);

   setUser(res.data.user);
   setPosts(res.data.posts || []);

  } catch (error) {
   console.log("Profile Error:", error.response?.data || error.message);
  } finally {
   setLoading(false);
  }

 };

 const renderPost = ({ item }) => (
  <Image
   source={{
    uri: item.image || "https://picsum.photos/300"
   }}
   style={styles.postImage}
  />
 );

 if (loading) {
  return (
   <View style={styles.center}>
    <ActivityIndicator size="large" />
   </View>
  );
 }

 return (




  <View style={styles.container}>


   <View style={styles.topHeader}>

         <TouchableOpacity onPress={() => navigation.goBack()}>
         <Icon name="arrow-back" size={26} color="#000" />
         </TouchableOpacity>

         <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.headerUsername}
         >
          {user?.name || "User Name"}
         </Text>

         <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={28} color="#000" />
         </TouchableOpacity>

     </View>

   {/* HEADER */}

   <View style={styles.header}>

    <Image
     source={{
      uri:
       user?.profilePic
        ? user.profilePic
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
     }}
     style={styles.profilePic}
    />

    <View style={styles.stats}>

     <View style={styles.stat}>
      <Text style={styles.statNumber}>{posts.length}</Text>
      <Text style={styles.statText}>Posts</Text>
     </View>

    <TouchableOpacity
     style={styles.stat}
     onPress={() =>
      navigation.navigate("FollowersFollowingScreen", {
       userId: user?._id,
       type: "followers"
      })
     }
    >
    <Text style={styles.statNumber}>{user?.followers?.length || 0}</Text>
    <Text style={styles.statText}>Followers</Text>
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.stat}
     onPress={() =>
      navigation.navigate("FollowersFollowingScreen", {
       userId: user?._id,
       type: "following"
      })
     }
    >
    <Text style={styles.statNumber}>{user?.following?.length || 0}</Text>
    <Text style={styles.statText}>Following</Text>
    </TouchableOpacity>

    </View>

   </View>

   {/* BIO */}

   <View style={styles.bioSection}>
    <Text style={styles.name}>{user?.pronouns || "User Name"} {user?.name || "User Name"}</Text>
    <Text>{user?.bio || ""}</Text>

    {user?.link ? (
     <Text style={styles.link}>{user.link}</Text>
    ) : null}

   </View>

   {/* BUTTONS */}

   <View style={styles.buttons}>

    <TouchableOpacity style={styles.editBtn} onPress={()=> navigation.navigate("Profile")}>
     <Text style={styles.btnText}>Edit Profile</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.shareBtn}>
     <Text style={styles.btnText}>Share Profile</Text>
    </TouchableOpacity>

   </View>

   {/* TABS */}

   <View style={styles.tabs}>

    <TouchableOpacity
     style={styles.tab}
     onPress={() => setActiveTab("posts")}
    >
     <Text style={activeTab === "posts" ? styles.activeTab : styles.tabText}>
      POSTS
     </Text>
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.tab}
     onPress={() => setActiveTab("swipes")}
    >
     <Text style={activeTab === "swipes" ? styles.activeTab : styles.tabText}>
      Swipes
     </Text>
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.tab}
     onPress={() => setActiveTab("tagged")}
    >
     <Text style={activeTab === "tagged" ? styles.activeTab : styles.tabText}>
      TAGGED
     </Text>
    </TouchableOpacity>

   </View>

   {/* POSTS GRID */}

   <FlatList
    data={posts}
    renderItem={renderPost}
    keyExtractor={(item) => item._id}
    numColumns={3}
    showsVerticalScrollIndicator={false}
   />


   <Modal
    visible={menuVisible}
    animationType="slide"
    transparent={true}
   >

    <TouchableOpacity
     style={styles.modalOverlay}
     onPress={() => setMenuVisible(false)}
    >

     <View style={styles.menuContainer}>

      <TouchableOpacity style={styles.menuItem}>
       <Text style={styles.menuText}>Become a Seller</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
       <Text style={styles.menuText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.menuItem}
       onPress={async () => {
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
       }}
      >
       <Text style={[styles.menuText, { color: "red" }]}>
        Logout
       </Text>
      </TouchableOpacity>

     </View>

    </TouchableOpacity>

   </Modal>

  </View>
 );
};

export default ProfileScreen;

const styles = StyleSheet.create({

 container:{
  flex:1,
  backgroundColor:"#fff"
 },

topHeader:{
 flexDirection:"row",
 alignItems:"center",
 justifyContent:"space-between",
 paddingHorizontal:15,
 paddingTop:50,
 paddingBottom:10,
 borderBottomWidth:1,
 borderColor:"#eee"

},
modalOverlay:{
 flex:1,
 backgroundColor:"rgba(0,0,0,0.3)",
 justifyContent:"flex-end"
},

menuContainer:{
 backgroundColor:"#fff",
 padding:20,
 borderTopLeftRadius:20,
 borderTopRightRadius:20
},

menuItem:{
 paddingVertical:15,
 borderBottomWidth:1,
 borderColor:"#eee"
},

menuText:{
 fontSize:16
},

headerUsername:{
 fontSize:18,
 fontWeight:"600",
 maxWidth:"60%"
},

 header:{
  flexDirection:"row",
  padding:20,
  alignItems:"center",
  paddingTop: 50
 },

 profilePic:{
  width:100,
  height:100,
  borderRadius:50,
  marginRight:20
 },

 stats:{
  flex:1,
  flexDirection:"row",
  justifyContent:"space-around"
 },

 stat:{
  alignItems:"center"
 },

 statNumber:{
  fontWeight:"bold",
  fontSize:18
 },

 statText:{
  color:"#444"
 },

 bioSection:{
  paddingHorizontal:20
 },

 name:{
  fontWeight:"bold",
  fontSize:15,
  marginBottom:3
 },

 link:{
  color:"#1877f2",
  marginTop:2
 },

 buttons:{
  flexDirection:"row",
  padding:15
 },

 editBtn:{
  borderWidth:1,
  borderColor:"#ccc",
  padding:8,
  borderRadius:6,
  flex:1,
  marginRight:5,
  alignItems:"center"
 },

 shareBtn:{
  borderWidth:1,
  borderColor:"#ccc",
  padding:8,
  borderRadius:6,
  flex:1,
  marginLeft:5,
  alignItems:"center"
 },

 btnText:{
  fontWeight:"500"
 },

 tabs:{
  flexDirection:"row",
  borderTopWidth:1,
  borderColor:"#eee",
  borderBottomWidth:1
 },

 tab:{
  flex:1,
  alignItems:"center",
  padding:10
 },

 tabText:{
  color:"#888"
 },

 activeTab:{
  color:"#000",
  fontWeight:"bold"
 },

 postImage:{
  width:"33.33%",
  height:130
 },

 center:{
  flex:1,
  justifyContent:"center",
  alignItems:"center"
 }

});