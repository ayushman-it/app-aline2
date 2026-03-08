import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from '../api/api';
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({ navigation }: any) => {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [gender, setGender] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    fetchUser();
  }, []);

    const pickImage = async () => {

      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.7
      });

      if (result.didCancel) return;

      const image = result.assets[0];

      setProfilePic(image.uri);

    };


  const fetchUser = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = res.data.user;

      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPronouns(user.pronouns || "");
      setGender(user.gender || "");
      setLink(user.link || "");
      setCategory(user.category || "");
      setProfilePic(user.profilePic || "");

    } catch (err) {
      console.log("Profile load error", err);
    } finally {
      setPageLoading(false);
    }
  };


  const updateProfile = async () => {

    try {

      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Login again");
        return;
      }

      const res = await API.post(
        "/auth/update-profile",
        {
          name,
          username,
          bio,
          pronouns,
          gender,
          link,
          category,
          profilePic
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        Alert.alert("Success", "Profile updated");
        navigation.goBack();
      }

    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }

  };


  if (pageLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.headerContainer}>

           <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
           </TouchableOpacity>

        <Text style={styles.header}>Edit Profile</Text>

        <View style={{ width: 20 }} />

      </View>


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >

          {/* Profile Image */}

          <View style={styles.imageContainer}>

            <Image
              source={{
                uri:
                  profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }}
              style={styles.profileImage}
            />

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.changePhoto}>
                Change profile photo
              </Text>
            </TouchableOpacity>

          </View>

          {renderInput("Name", name, setName)}
          {renderInput("Username", username, setUsername)}
          {renderInput("Bio", bio, setBio, true)}
          {renderInput("Pronouns", pronouns, setPronouns)}
          {renderInput("Gender", gender, setGender)}
          {renderInput("Link", link, setLink)}
          {renderInput("Profile Category", category, setCategory)}

        </ScrollView>


        {/* Save Button */}

        <View style={styles.bottomContainer}>

          <TouchableOpacity
            style={[
              styles.saveButton,
              loading && { opacity: 0.7 }
            ]}
            onPress={updateProfile}
            disabled={loading}
          >

            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>
                Save Changes
              </Text>
            )}

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};



const renderInput = (
  label: string,
  value: string,
  setter: any,
  multiline = false
) => (
  <View style={styles.inputGroup}>

    <Text style={styles.label}>{label}</Text>

    <TextInput
      style={[
        styles.input,
        multiline && { height: 90 }
      ]}
      value={value}
      onChangeText={setter}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#888"
      multiline={multiline}
    />

  </View>
);


export default ProfileScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 50,
  },

  header: {
    fontSize: 18,
    fontWeight: '600'
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 10
  },

  changePhoto: {
    color: '#0095f6',
    fontWeight: '600',
    fontSize: 14
  },

  inputGroup: {
    marginBottom: 20,
    paddingHorizontal: 20
  },

  label: {
    fontSize: 13,
    marginBottom: 5,
    color: '#444'
  },

  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    backgroundColor: '#fafafa'
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee'
  },

  saveButton: {
    backgroundColor: '#000',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }

});