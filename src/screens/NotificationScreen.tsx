import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { API } from "../api/api";

import { io } from "socket.io-client";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    socketRef.current = io("http://172.20.10.3:5000", {
      transports: ["websocket"]
    });

    socketRef.current.on("connect", () => console.log("Socket connected"));

    socketRef.current.on("receiveNotification", (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // ⭐ FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await API.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ DELETE NOTIFICATION
  const deleteNotification = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await API.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ⭐ TAP NAVIGATION
  const handlePress = (item) => {
    if(item.type === "follow") {
      navigation.navigate("ProfilePreviewScreen",{ userId:item.sender?._id });
    }
    if(item.type === "like" || item.type === "comment") {
      navigation.navigate("PostDetail",{ postId:item.post });
    }
  };

  // ⭐ TEXT GENERATOR
  const getNotificationText = (item) => {
    switch(item.type) {
      case "follow": return " started following you";
      case "like": return " liked your post ❤️";
      case "comment": return " commented on your post 💬";
      case "swipe": return " matched with you 🔥";
      default: return " sent notification";
    }
  };

  const getIcon = (type) => {
    switch(type){
      case "follow": return "person-add-outline";
      case "like": return "heart-outline";
      case "comment": return "chatbubble-outline";
      case "swipe": return "flame-outline";
      default: return "notifications-outline";
    }
  };

  // ⭐ FORMAT TIME & GROUP
  const getNotificationGroup = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000*60*60*24));

    if(diffDays === 0) return "Today";
    else if(diffDays === 1) return "Yesterday";
    else if(diffDays < 7) return `${diffDays} days ago`;
    else return "Earlier";
  };

  // ⭐ GROUP NOTIFICATIONS
  const groupNotifications = () => {
    const groups = {};
    notifications.forEach(n => {
      const group = getNotificationGroup(n.createdAt);
      if(!groups[group]) groups[group] = [];
      groups[group].push(n);
    });
    return groups;
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteBtn} onPress={()=>deleteNotification(id)}>
      <Icon name="trash" size={22} color="#fff" />
    </TouchableOpacity>
  );

  const renderNotification = ({ item }) => (
    <Swipeable renderRightActions={()=>renderRightActions(item._id)}>
      <TouchableOpacity style={styles.card} onPress={()=>handlePress(item)}>
        <Image
          source={{ uri: item.sender?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
          style={styles.avatar}
        />
        <View style={{flex:1}}>
          <Text style={styles.title}>
            {item.sender?.username}
            <Text style={styles.msg}> {getNotificationText(item)}</Text>
          </Text>
          <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([], {hour:"numeric", minute:"numeric", hour12:true})}</Text>
        </View>

        <Icon name={getIcon(item.type)} size={22} color="#555" />
      </TouchableOpacity>
    </Swipeable>
  );

  if(loading){
    return <View style={styles.center}><ActivityIndicator size="large"/></View>;
  }

  const grouped = groupNotifications();
  const groupKeys = Object.keys(grouped);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={24}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Icon name="settings-outline" size={24}/>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupKeys}
        keyExtractor={(item,index)=>index.toString()}
        renderItem={({item})=>(
          <View>
            <Text style={styles.groupTitle}>{item}</Text>
            {grouped[item].map(n => <View key={n._id}>{renderNotification({item:n})}</View>)}
          </View>
        )}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:"#f7f7f7"},
  header:{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:18, paddingTop:55, paddingBottom:14, borderBottomWidth:1, borderColor:"#eee", backgroundColor:"#fff"},
  headerTitle:{fontSize:19, fontWeight:"600", letterSpacing:0.3},
  groupTitle:{fontSize:16, fontWeight:"600", marginLeft:20, marginTop:20, marginBottom:5, color:"#555"},
  card:{flexDirection:"row", alignItems:"center", paddingVertical:14, paddingHorizontal:14, marginHorizontal:14, marginTop:10, borderRadius:16, backgroundColor:"#fff", shadowColor:"#000", shadowOpacity:0.06, shadowRadius:8, shadowOffset:{width:0,height:2}, elevation:3},
  avatar:{width:52, height:52, borderRadius:26, marginRight:14, backgroundColor:"#ddd"},
  title:{fontWeight:"600", fontSize:14, color:"#111"},
  msg:{fontWeight:"400", color:"#555", fontSize:14},
  time:{fontSize:12, color:"#999", marginTop:4},
  deleteBtn:{backgroundColor:"#ff3b30", justifyContent:"center", alignItems:"center", width:80, marginTop:10, borderTopRightRadius:0, borderBottomRightRadius:0},
  center:{flex:1, justifyContent:"center", alignItems:"center"},
  unreadDot:{width:10, height:10, borderRadius:5, backgroundColor:"#0095f6", position:"absolute", right:40, top:26}
});