import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Image
} from "react-native";

const CreatePostScreen = ({ navigation }) => {

const [mode,setMode] = useState("post");
const [image,setImage] = useState(null);
const [ratio,setRatio] = useState("1:1");


// Dummy image (temporary)
const openGallery = () => {

setImage("https://picsum.photos/800/800");

};


// Ratio logic
const getRatioStyle = () => {

if(ratio==="1:1") return {aspectRatio:1};
if(ratio==="4:5") return {aspectRatio:4/5};
if(ratio==="16:9") return {aspectRatio:16/9};

return {aspectRatio:1};

};


return(

<View style={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<Text style={styles.title}>Create</Text>

<TouchableOpacity
disabled={!image}
onPress={()=>navigation.navigate("Editor",{image})}
>

<Text style={styles.next}>Next</Text>

</TouchableOpacity>

</View>



{/* IMAGE PREVIEW */}

<View style={[styles.preview,getRatioStyle()]}>

{image ? (

<Image
source={{uri:image}}
style={styles.image}
/>

) : (

<Text style={{color:"#999"}}>
Select Image
</Text>

)}

</View>



{/* RATIO SELECTOR */}

<View style={styles.ratioRow}>

<TouchableOpacity onPress={()=>setRatio("1:1")}>
<Text style={ratio==="1:1"?styles.active:styles.ratio}>
1:1
</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setRatio("4:5")}>
<Text style={ratio==="4:5"?styles.active:styles.ratio}>
4:5
</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setRatio("16:9")}>
<Text style={ratio==="16:9"?styles.active:styles.ratio}>
16:9
</Text>
</TouchableOpacity>

</View>



{/* SELECT IMAGE */}

<View style={styles.controls}>

<TouchableOpacity
style={styles.selectBtn}
onPress={openGallery}
>

<Text style={{color:"#fff"}}>
Pick Image
</Text>

</TouchableOpacity>

</View>



{/* MODE SELECTOR */}

<View style={styles.modeContainer}>

<TouchableOpacity onPress={()=>setMode("post")}>
<Text style={mode==="post"?styles.modeActive:styles.mode}>
POST
</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setMode("story")}>
<Text style={mode==="story"?styles.modeActive:styles.mode}>
STORY
</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>setMode("reel")}>
<Text style={mode==="reel"?styles.modeActive:styles.mode}>
REEL
</Text>
</TouchableOpacity>

</View>

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
padding:15,
borderBottomWidth:1,
borderColor:"#eee",
paddingTop: 50,
},

title:{
fontSize:18,
fontWeight:"bold"
},

next:{
fontSize:16,
color:"#1877f2"
},

preview:{
width:"100%",
backgroundColor:"#000",
justifyContent:"center",
alignItems:"center"
},

image:{
width:"100%",
height:"100%",
resizeMode:"cover"
},

ratioRow:{
flexDirection:"row",
justifyContent:"space-around",
paddingVertical:15
},

ratio:{
color:"#777",
fontSize:16
},

active:{
color:"#000",
fontWeight:"bold"
},

controls:{
alignItems:"center",
paddingVertical:20
},

selectBtn:{
backgroundColor:"#000",
padding:15,
borderRadius:8
},

modeContainer:{
flexDirection:"row",
justifyContent:"space-around",
borderTopWidth:1,
borderColor:"#eee",
padding:15
},

mode:{
color:"#777",
fontSize:16
},

modeActive:{
color:"#000",
fontWeight:"bold",
fontSize:16
}

});