import React from "react";
import {
 View,
 Text,
 StyleSheet,
 Image,
 ScrollView,
 TouchableOpacity
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

function FeedScreen({navigation}: any) {

 const stories = ["You","Rahul","Reema","Amit","Rohit","Neha"];

 return (

  <View style={styles.container}>

   {/* Header */}

   <View style={styles.header}>

    <View style={styles.headerLeft}>

     <Image
      source={{uri:"https://aline2.com/asstes/images/logo/logo.jpeg"}}
      style={styles.logo}
     />

     <Text style={styles.title}>Aline2</Text>

    </View>

    <View style={styles.headerRight}>

     <Icon onPress={()=> navigation.navigate('Search')} name="search-outline" size={24} color="#333"/>
    <Icon
     onPress={() => navigation.navigate('NotificationScreen')}
     name="notifications-outline"
     size={24}
     color="#333"
     style={{marginLeft:15}}
    />
    </View>

   </View>


   <ScrollView showsVerticalScrollIndicator={false}>

    {/* Stories */}

    <ScrollView
     horizontal
     showsHorizontalScrollIndicator={false}
     style={styles.storyContainer}
    >

     {stories.map((name,i)=>(

      <View key={i} style={styles.story}>

       <Image
        source={{uri:"https://randomuser.me/api/portraits/men/1.jpg"}}
        style={styles.storyImage}
       />

       <Text style={styles.storyText}>{name}</Text>

      </View>

     ))}

    </ScrollView>


    {/* Post */}

    <View style={styles.post}>

     <View style={styles.postHeader}>

      <Image
       source={{uri:"https://randomuser.me/api/portraits/women/2.jpg"}}
       style={styles.postProfile}
      />

      <Text style={styles.postUser}>@reema</Text>

      <Icon
       name="ellipsis-horizontal"
       size={20}
       color="#333"
       style={{marginLeft:"auto"}}
      />

     </View>

     <Image
      source={{uri:"https://picsum.photos/500"}}
      style={styles.postImage}
     />

     <View style={styles.postActions}>

      <TouchableOpacity>
       <Icon name="heart-outline" size={24} color="#333"/>
      </TouchableOpacity>

      <TouchableOpacity>
       <Icon name="chatbubble-outline" size={24} color="#333"/>
      </TouchableOpacity>

      <TouchableOpacity>
       <Icon name="paper-plane-outline" size={24} color="#333"/>
      </TouchableOpacity>

      <TouchableOpacity style={{marginLeft:"auto"}}>
       <Icon name="bookmark-outline" size={24} color="#333"/>
      </TouchableOpacity>

     </View>

     <Text style={styles.likes}>120 likes</Text>

    </View>

   </ScrollView>

  </View>

 );

}

export default FeedScreen;


const styles = StyleSheet.create({

 container:{
  flex:1,
  backgroundColor:"#fff"
 },

 header:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  paddingHorizontal:15,
  paddingVertical:12,
  borderBottomWidth:0.5,
  borderColor:"#ddd",
  paddingTop: 40,
  marginBottom: 10,
 },

 headerLeft:{
  flexDirection:"row",
  alignItems:"center"
 },

 logo:{
  width:40,
  height:40,
  borderRadius:20,
  marginRight:8
 },

 title:{
  fontSize:28,
  fontWeight:"bold",
  color:"#7b3fe4"
 },

 headerRight:{
  flexDirection:"row",
  alignItems:"center"
 },

 storyContainer:{
  paddingVertical:12,
  paddingLeft:10
 },

 story:{
  alignItems:"center",
  marginRight:15
 },

 storyImage:{
  width:70,
  height:70,
  borderRadius:40,
  borderWidth:2,
  borderColor:"#a64bf4"
 },

 storyText:{
  fontSize:12,
  marginTop:4
 },

 post:{
  marginBottom:20
 },

 postHeader:{
  flexDirection:"row",
  alignItems:"center",
  padding:10
 },

 postProfile:{
  width:36,
  height:36,
  borderRadius:20,
  marginRight:8
 },

 postUser:{
  fontWeight:"bold",
  fontSize:14
 },

 postImage:{
  width:"100%",
  height:300
 },

 postActions:{
  flexDirection:"row",
  padding:10,
  gap:15
 },

 likes:{
  fontWeight:"bold",
  paddingHorizontal:10
 }

});