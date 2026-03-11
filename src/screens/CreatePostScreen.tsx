import React, { useState, useEffect } from "react";
import {
 View,
 Text,
 StyleSheet,
 TouchableOpacity,
 Image,
 TextInput,
 FlatList,
 ScrollView,
 ActivityIndicator
} from "react-native";

import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../api/api";

const filters = [
 { name: "Normal", overlay: null },
 { name: "Warm", overlay: "rgba(255,150,0,0.25)" },
 { name: "Cool", overlay: "rgba(0,150,255,0.25)" },
 { name: "Vintage", overlay: "rgba(120,80,40,0.3)" }
];

const CreatePostScreen = ({ navigation }) => {

 const [step,setStep] = useState(1);
 const [images,setImages] = useState([]);
 const [selectedFilter,setSelectedFilter] = useState(filters[0]);

 const [caption,setCaption] = useState("");
 const [location,setLocation] = useState("");
 const [music,setMusic] = useState("");

 const [text,setText] = useState("");
 const [showText,setShowText] = useState(false);

 const [taggedUsers,setTaggedUsers] = useState([]);
 const [friends,setFriends] = useState([]);

 const [loading,setLoading] = useState(true);

 useEffect(()=>{
  loadUser();
 },[]);

 const loadUser = async ()=>{

  try{

   const user = await AsyncStorage.getItem("user");

   if(!user){
    setLoading(false);
    return;
   }

   const parsed = JSON.parse(user);

   fetchFriends(parsed._id);

  }catch(err){
   console.log(err);
   setLoading(false);
  }

 };

 const fetchFriends = async(id)=>{

  try{

   const token = await AsyncStorage.getItem("token");

   const followersRes = await API.get(`/auth/followers/${id}`,{
    headers:{Authorization:`Bearer ${token}`}
   });

   const followingRes = await API.get(`/auth/following/${id}`,{
    headers:{Authorization:`Bearer ${token}`}
   });

   const followers = followersRes?.data?.followers || [];
   const following = followingRes?.data?.following || [];

   const merged = [...followers,...following];

   const unique = merged.filter(
    (v,i,a)=>a.findIndex(t=>t._id===v._id)===i
   );

   setFriends(unique);

  }catch(err){
   console.log(err);
  }finally{
   setLoading(false);
  }

 };

 const handleBack = ()=>{

  if(step > 1){
   setStep(step - 1);
  }else{
   navigation.goBack();
  }

 };

 const pickImages = async ()=>{

  const result = await launchImageLibrary({
   mediaType:"photo",
   selectionLimit:5,
   quality:1
  });

  console.log("IMAGE RESULT",result);

  if(result?.assets && result.assets.length > 0){
   setImages(result.assets);
  }

 };

 const toggleTag = (user)=>{

  if(taggedUsers.find(u=>u._id===user._id)){
   setTaggedUsers(taggedUsers.filter(u=>u._id!==user._id));
  }else{
   setTaggedUsers([...taggedUsers,user]);
  }

 };

 const renderImage = ()=>{

  if(!images?.length){
   return(
    <View style={styles.noImage}>
     <Text style={{color:"#aaa"}}>Select Image</Text>
    </View>
   );
  }

  const uri = images?.[0]?.uri;

  return(

   <View style={{width:"100%",height:"100%"}}>

    <Image
     source={{uri}}
     style={styles.image}
     resizeMode="cover"
    />

    {selectedFilter.overlay && (
     <View
      style={[
       StyleSheet.absoluteFillObject,
       {backgroundColor:selectedFilter.overlay}
      ]}
     />
    )}

    {showText && (
     <Text style={styles.overlayText}>{text}</Text>
    )}

   </View>

  );

 };

 const handleNext = ()=>{

  if(step < 4){
   setStep(step + 1);
  }else{

   const data = {
    images,
    filter:selectedFilter.name,
    caption,
    location,
    music,
    text,
    taggedUsers
   };

   console.log("POST DATA",data);

  }

 };

 if(loading){
  return(
   <View style={styles.center}>
    <ActivityIndicator size="large" color="#0095f6"/>
   </View>
  );
 }

 return(

<View style={styles.container}>

<View style={styles.header}>

<TouchableOpacity onPress={handleBack}>
<Icon name="arrow-back" size={26}/>
</TouchableOpacity>

<Text style={styles.title}>New Post</Text>

<TouchableOpacity onPress={handleNext}>
<Text style={styles.next}>
{step===4 ? "Share":"Next"}
</Text>
</TouchableOpacity>

</View>

<View style={styles.preview}>
{renderImage()}
</View>

{step===1 && (

<View style={styles.center}>

<TouchableOpacity
style={styles.primaryBtn}
onPress={pickImages}
>

<Icon name="images" size={22} color="#fff"/>

<Text style={styles.primaryText}>
Select Images
</Text>

</TouchableOpacity>

</View>

)}

{step===2 && (

<FlatList
horizontal
showsHorizontalScrollIndicator={false}
data={filters}
keyExtractor={(item)=>item.name}
style={{paddingVertical:15}}
renderItem={({item})=>(

<TouchableOpacity
style={styles.filterItem}
onPress={()=>setSelectedFilter(item)}
>

<View style={styles.filterPreview}>

{images?.[0]?.uri && (
<Image
source={{uri:images[0].uri}}
style={styles.filterImage}
/>
)}

{item.overlay && (
<View
style={[
StyleSheet.absoluteFillObject,
{backgroundColor:item.overlay}
]}
/>
)}

</View>

<Text style={styles.filterText}>
{item.name}
</Text>

</TouchableOpacity>

)}
/>

)}

{step===3 && (

<View style={styles.editTools}>

<TextInput
placeholder="Add text on image"
value={text}
onChangeText={setText}
style={styles.input}
/>

<TouchableOpacity
style={styles.secondaryBtn}
onPress={()=>setShowText(true)}
>
<Text>Add Text</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.musicBtn}>
<Icon name="musical-notes"/>
<Text style={{marginLeft:6}}>
{music ? music : "Add Music"}
</Text>
</TouchableOpacity>

</View>

)}

{step===4 && (

<ScrollView style={styles.captionContainer}>

<View style={styles.captionRow}>

<Image
source={{uri:images?.[0]?.uri}}
style={styles.captionImage}
/>

<TextInput
placeholder="Write a caption..."
value={caption}
onChangeText={setCaption}
style={styles.captionInput}
multiline
/>

</View>

<TextInput
placeholder="Add Location"
value={location}
onChangeText={setLocation}
style={styles.input}
/>

<Text style={styles.tagTitle}>
Tag People
</Text>

{friends.map(user=>{

const selected = taggedUsers.find(
u=>u._id===user._id
);

return(

<TouchableOpacity
key={user._id}
style={styles.friend}
onPress={()=>toggleTag(user)}
>

<Image
source={{
uri:user.profilePic ||
"https://cdn-icons-png.flaticon.com/512/149/149071.png"
}}
style={styles.avatar}
/>

<Text style={{flex:1}}>
{user.username}
</Text>

{selected && (
<Icon
name="checkmark-circle"
size={22}
color="#0095f6"
/>
)}

</TouchableOpacity>

);

})}

</ScrollView>

)}

</View>

 );

};

export default CreatePostScreen;

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#fff"
},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingTop:50,
paddingHorizontal:20,
paddingBottom:10,
borderBottomWidth:0.5,
borderColor:"#ddd"
},

title:{
fontSize:18,
fontWeight:"600"
},

next:{
color:"#0095f6",
fontWeight:"600",
fontSize:16
},

preview:{
height:400,
width:"100%",
backgroundColor:"#000"
},

image:{
width:"100%",
height:"100%"
},

overlayText:{
position:"absolute",
color:"#fff",
fontSize:32,
fontWeight:"bold",
alignSelf:"center",
top:"45%"
},

center:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

primaryBtn:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#0095f6",
paddingVertical:14,
paddingHorizontal:22,
borderRadius:12
},

primaryText:{
color:"#fff",
marginLeft:8,
fontWeight:"600"
},

filterItem:{
alignItems:"center",
marginHorizontal:10
},

filterPreview:{
width:70,
height:70,
borderRadius:12,
overflow:"hidden"
},

filterImage:{
width:"100%",
height:"100%"
},

filterText:{
marginTop:5,
fontSize:12
},

editTools:{
padding:20
},

input:{
backgroundColor:"#f2f2f2",
padding:12,
borderRadius:10,
marginBottom:15
},

secondaryBtn:{
backgroundColor:"#eee",
padding:10,
alignItems:"center",
borderRadius:8,
marginBottom:15
},

musicBtn:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#f2f2f2",
padding:12,
borderRadius:10
},

captionContainer:{
padding:15
},

captionRow:{
flexDirection:"row",
alignItems:"center",
marginBottom:15
},

captionImage:{
width:70,
height:70,
borderRadius:10,
marginRight:10
},

captionInput:{
flex:1,
backgroundColor:"#f2f2f2",
borderRadius:10,
padding:10,
minHeight:70
},

tagTitle:{
fontWeight:"bold",
marginBottom:10
},

friend:{
flexDirection:"row",
alignItems:"center",
paddingVertical:12,
borderBottomWidth:1,
borderColor:"#eee"
},

avatar:{
width:40,
height:40,
borderRadius:20,
marginRight:10
},

noImage:{
flex:1,
justifyContent:"center",
alignItems:"center"
}

});