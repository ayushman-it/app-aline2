import React, {useState, useRef} from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
Image,
Dimensions
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import {launchImageLibrary} from "react-native-image-picker";
import {Camera, useCameraDevices} from "react-native-vision-camera";

const {width} = Dimensions.get("window");

const CreatePostScreen = ({navigation}) => {

const camera = useRef(null);
const devices = useCameraDevices();
const device = devices.back;

const [mode,setMode] = useState("post");
const [image,setImage] = useState(null);
const [ratio,setRatio] = useState("auto");


// Pick from gallery
const openGallery = () => {

launchImageLibrary(
{
mediaType:"photo",
quality:1
},
(res)=>{

if(res.assets){
setImage(res.assets[0].uri);
}

}
);

};


// Capture photo
const capturePhoto = async () => {

if(camera.current){

const photo = await camera.current.takePhoto();

setImage("file://"+photo.path);

}

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



{/* CAMERA / IMAGE PREVIEW */}

<View style={[styles.preview,getRatioStyle()]}>

{image ? (

<Image
source={{uri:image}}
style={styles.image}
/>

) : device ? (

<Camera
ref={camera}
style={styles.camera}
device={device}
isActive={true}
photo={true}
/>

) : null}

</View>



{/* RATIO SELECTOR */}

<View style={styles.ratioRow}>

<TouchableOpacity onPress={()=>setRatio("auto")}>
<Text style={ratio==="auto"?styles.active:styles.ratio}>
AUTO
</Text>
</TouchableOpacity>

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



{/* CAMERA CONTROLS */}

<View style={styles.controls}>

<TouchableOpacity onPress={openGallery}>
<Icon name="images-outline" size={30}/>
</TouchableOpacity>

<TouchableOpacity
style={styles.captureBtn}
onPress={capturePhoto}
/>

<TouchableOpacity>
<Icon name="camera-reverse-outline" size={30}/>
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
borderColor:"#eee"
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

camera:{
width:"100%",
height:"100%"
},

image:{
width:"100%",
height:"100%",
resizeMode:"cover"
},

ratioRow:{
flexDirection:"row",
justifyContent:"space-around",
paddingVertical:10
},

ratio:{
color:"#777",
fontSize:14
},

active:{
color:"#000",
fontWeight:"bold"
},

controls:{
flexDirection:"row",
justifyContent:"space-around",
alignItems:"center",
paddingVertical:20
},

captureBtn:{
width:70,
height:70,
borderRadius:40,
backgroundColor:"#000"
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