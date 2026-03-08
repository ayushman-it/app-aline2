import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator

} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../api/api";
import Icon from "react-native-vector-icons/Ionicons";

const SearchScreen = ({ navigation }) => {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Filter out self
  const filterOutSelf = (userList) => {
    if (!currentUserId) return userList;
    return userList.filter(user => user._id !== currentUserId);
  };

  useEffect(() => {
    getCurrentUserId();
  }, []);

  const getCurrentUserId = async () => {
    const id = await AsyncStorage.getItem("userId"); // save userId in AsyncStorage on login
    setCurrentUserId(id);
    fetchUsers(id);
  };

const fetchUsers = async (userId) => {
  try {

    const token = await AsyncStorage.getItem("token");

    const res = await API.get("/auth/users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const users = res.data.users || [];

    // remove logged in user
    const filtered = users.filter(u => u._id !== userId);

    setUsers(filtered);

  } catch (error) {
    console.log("Users Error:", error);
  } finally {
    setLoading(false);
  }
};

const searchUsers = async (text) => {

  setSearch(text);

  try {

    const token = await AsyncStorage.getItem("token");

    const res = await API.get(`/auth/search?query=${text}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const filteredUsers = res.data.users.filter(
      user => user._id !== currentUserId
    );

    setUsers(filteredUsers);

  } catch (error) {
    console.log("Search Error:", error);
  }
};

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() =>
        navigation.navigate("ProfilePreviewScreen", {
          userId: item._id
        })
      }
    >
      <Image
        source={{
          uri: item.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }}
        style={styles.avatar}
      />

      <View>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Search</Text>

        <TouchableOpacity>
          <Icon name="options-outline" size={24} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#777" />
        <TextInput
          placeholder="Search users..."
          style={styles.searchInput}
          value={search}
          onChangeText={searchUsers}
        />
      </View>

      {/* USERS LIST */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    marginLeft: 8
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  username: {
    fontWeight: "bold"
  },
  name: {
    color: "#666"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});