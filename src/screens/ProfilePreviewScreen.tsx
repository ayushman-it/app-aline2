import React, { useEffect, useState } from "react";
import {
 View,
 Text,
 StyleSheet,
 Image,
 TouchableOpacity,
 FlatList,
 ActivityIndicator,
 Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { API } from "../api/api";

const ProfilePreviewScreen = ({ route, navigation }) => {

 const { userId } = route.params;

 const [user, setUser] = useState(null);
 const [posts, setPosts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState("posts");
 const [isFollowing, setIsFollowing] = useState(false);
 const [isMutual, setIsMutual] = useState(false);
 const [actionLoading, setActionLoading] = useState(false);

 useEffect(() => {
  fetchProfile();
 }, []);

 // ⭐ FETCH PROFILE
const fetchProfile = async () => {
 try {

  const token = await AsyncStorage.getItem("token");

  const res = await API.get(`/auth/user/${userId}`, {
   headers: { Authorization: `Bearer ${token}` }
  });

  const profileUser = res.data.user;
  const me = res.data.me;

  setUser(profileUser);
  setPosts(profileUser.posts || []);

const amIFollowing = me?.following?.some(
 id => String(id) === String(userId)
);

const isHeFollowingMe = profileUser?.followers?.some(
 id => String(id) === String(me?._id)
);

const isNotMyProfile =
 String(profileUser?._id) !== String(me?._id);

setIsFollowing(!!amIFollowing);
setIsMutual(!!(amIFollowing && isHeFollowingMe && isNotMyProfile));

 } catch (err) {
  console.log(err);
 } finally {
  setLoading(false);
 }
};

 // ⭐ FOLLOW USER
const followUser = async () => {
 try {

  setActionLoading(true);

  const token = await AsyncStorage.getItem("token");

  await API.post(
   `/auth/follow/${userId}`,
   {},
   { headers: { Authorization: `Bearer ${token}` } }
  );

  await fetchProfile();

  Alert.alert("Success ✅", "You are now following");

 } catch (err) {

  Alert.alert("Error", "Something went wrong");

 } finally {
  setActionLoading(false);
 }
};

 // ⭐ UNFOLLOW USER
const unfollowUser = async () => {

 Alert.alert(
  "Unfollow",
  "Are you sure?",
  [
   { text: "Cancel", style: "cancel" },

   {
    text: "Unfollow",
    style: "destructive",

    onPress: async () => {

     try {

      setActionLoading(true);

      const token = await AsyncStorage.getItem("token");

      await API.post(
       `/auth/unfollow/${userId}`,
       {},
       { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchProfile();

      Alert.alert("Done ✅", "Unfollowed");

     } catch (err) {

      Alert.alert("Error", "Something went wrong");

     } finally {
      setActionLoading(false);
     }

    }
   }
  ]
 );
};


 const renderPost = ({ item }) => (
  <Image
   source={{ uri: item.image || "https://picsum.photos/300" }}
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

   {/* HEADER */}
   <View style={styles.topHeader}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
     <Icon name="arrow-back" size={26} />
    </TouchableOpacity>

    <Text numberOfLines={1} style={styles.headerUsername}>
     {user?.username}
    </Text>

    <Icon name="menu" size={26} />
   </View>

   {/* PROFILE HEADER */}
   <View style={styles.header}>
    <Image
     source={{
      uri:
       user?.profilePic ||
       "https://cdn-icons-png.flaticon.com/512/149/149071.png"
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

     <View style={styles.stat}>
      <Text style={styles.statNumber}>{user?.following?.length || 0}</Text>
      <Text style={styles.statText}>Following</Text>
     </View>
    </View>
   </View>

   {/* BIO */}
   <View style={styles.bioSection}>
    <Text style={styles.name}>{user?.name}</Text>
    <Text>{user?.bio}</Text>

    {user?.link && (
     <Text style={styles.link}>{user.link}</Text>
    )}
   </View>

   {/* FOLLOW BUTTONS */}
  <View style={styles.buttons}>

   {isFollowing ? (
    <TouchableOpacity
     activeOpacity={0.7}
     style={styles.unfollowBtn}
     onPress={unfollowUser}
     disabled={actionLoading}
    >
     <Text>Following</Text>
    </TouchableOpacity>
   ) : (
    <TouchableOpacity
     activeOpacity={0.7}
     style={styles.followBtn}
     onPress={followUser}
     disabled={actionLoading}
    >
     <Text style={{ color: "#fff" }}>
      {actionLoading ? "Loading..." : "Follow"}
     </Text>
    </TouchableOpacity>
   )}

   {/* ⭐ MESSAGE BUTTON FIX */}
 {isMutual && (
  <TouchableOpacity
   style={styles.messageBtn}
   activeOpacity={0.7}
   onPress={() => navigation.navigate("ChatScreen", {
    userId: user?._id
   })}
  >
   <Icon name="chatbubble-ellipses-outline" size={20} color="#000" />
    <Text style={{ marginLeft:6 }}>Message</Text>
  </TouchableOpacity>
 )}

  </View>

   {/* TABS */}
   <View style={styles.tabs}>
    <TouchableOpacity
     style={styles.tab}
     onPress={() => setActiveTab("posts")}
    >
     <Icon
      name="grid-outline"
      size={22}
      color={activeTab === "posts" ? "#000" : "#888"}
     />
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.tab}
     onPress={() => setActiveTab("swipes")}
    >
     <Icon
      name="heart-outline"
      size={22}
      color={activeTab === "swipes" ? "#000" : "#888"}
     />
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.tab}
     onPress={() => setActiveTab("tagged")}
    >
     <Icon
      name="person-outline"
      size={22}
      color={activeTab === "tagged" ? "#000" : "#888"}
    />
    </TouchableOpacity>
   </View>

   {/* POSTS GRID */}
   <View style={{ flex: 1 }}>
    <FlatList
     data={posts}
     renderItem={renderPost}
     keyExtractor={(item) => item._id}
     numColumns={3}
     showsVerticalScrollIndicator={false}
    />
   </View>

  </View>
 );
};

export default ProfilePreviewScreen;

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

 headerUsername:{
  fontSize:18,
  fontWeight:"600",
  maxWidth:"60%"
 },

 header:{
  flexDirection:"row",
  padding:20,
  alignItems:"center"
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
  paddingHorizontal:15,
  marginTop:10
},

 followBtn:{
   backgroundColor:"#0095f6",
   paddingVertical:8,
   borderRadius:6,
   flex:1,
   marginRight:5,
   alignItems:"center",
   justifyContent:"center"
 },

 unfollowBtn:{
   borderWidth:1,
   borderColor:"#ccc",
   paddingVertical:8,
   borderRadius:6,
   flex:1,
   marginRight:5,
   alignItems:"center",
   justifyContent:"center"
 },

 messageBtn:{
   borderWidth:1,
   borderColor:"#ccc",
   padding:8,
   borderRadius:6,
   flex:1,
   marginLeft:5,
   alignItems:"center",
   justifyContent:"center",
   flexDirection:"row"
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