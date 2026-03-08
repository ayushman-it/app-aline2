import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { Platform, TouchableNativeFeedback, View, StyleSheet } from "react-native";

import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileView from "../screens/ProfileView";
import SearchScreen from "../screens/SearchScreen";
import ProfilePreviewScreen from "../screens/ProfilePreviewScreen";
import CreatePostScreen from "../screens/CreatePostScreen";

const Tab = createBottomTabNavigator();

// Dummy screen for Add / Notify (optional)
function DummyScreen() {
  return null;
}

// Bottom Tabs
export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ab2aeb",
        tabBarInactiveTintColor: "#555",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Feed") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Search") iconName = focused ? "search" : "search-outline";
          else if (route.name === "Add") iconName = focused ? "add-circle" : "add-circle-outline";
          else if (route.name === "Notify") iconName = focused ? "heart" : "heart-outline";
          else if (route.name === "ProfileView") iconName = focused ? "person" : "person-outline";
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
                <View style={styles.tabButtonContainer}>{props.children}</View>
              </TouchableNativeFeedback>
            );
          }
          return <View style={styles.tabButtonContainer}>{props.children}</View>;
        },
      })}
      tabBarOptions={{
        style: { height: 60, backgroundColor: "#fff", borderTopWidth: 0.5, borderTopColor: "#ddd" },
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={CreatePostScreen} />
      <Tab.Screen name="Notify" component={DummyScreen} />
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