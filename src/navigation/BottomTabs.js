import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { Platform, TouchableNativeFeedback, View, StyleSheet } from "react-native";

import FeedScreen from "../screens/FeedScreen";
import ProfileView from "../screens/ProfileView";
import SearchScreen from "../screens/SearchScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import AllChatsScreen from "../screens/AllChatsScreen"; // 👈 import chat screen

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ab2aeb",
        tabBarInactiveTintColor: "#555",

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Feed")
            iconName = focused ? "home" : "home-outline";

          else if (route.name === "Search")
            iconName = focused ? "search" : "search-outline";

          else if (route.name === "Add")
            iconName = focused ? "add-circle" : "add-circle-outline";

          else if (route.name === "Chats")
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";

          else if (route.name === "ProfileView")
            iconName = focused ? "person" : "person-outline";

          return <Icon name={iconName} size={26} color={color} />;
        },

        tabBarButton: (props) => {
          if (Platform.OS === "android") {
            return (
              <TouchableNativeFeedback
                {...props}
                background={TouchableNativeFeedback.Ripple("rgba(171,42,235,0.2)", true, 25)}
                useForeground={true}
              >
                <View style={styles.tabButtonContainer}>
                  {props.children}
                </View>
              </TouchableNativeFeedback>
            );
          }

          return (
            <View style={styles.tabButtonContainer}>
              {props.children}
            </View>
          );
        },
      })}
    >

      <Tab.Screen name="Feed" component={FeedScreen} />

      <Tab.Screen name="Search" component={SearchScreen} />

      <Tab.Screen name="Add" component={CreatePostScreen} />

      {/* CHAT TAB */}
      <Tab.Screen name="Chats" component={AllChatsScreen} />

      <Tab.Screen name="ProfileView" component={ProfileView} />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
});