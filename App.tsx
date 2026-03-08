import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import OtpVerifyScreen from './src/screens/OtpVerifyScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FeedScreen from './src/screens/FeedScreen';
import ProfileView from './src/screens/ProfileView';
import ProfilePreviewScreen from './src/screens/ProfilePreviewScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import FollowersFollowingScreen from './src/screens/FollowersFollowingScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';

import BottomTabs from './src/navigation/BottomTabs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="ProfileView" component={ProfileView} />

          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />

          {/* Main App */}
          <Stack.Screen name="MainApp" component={BottomTabs} />

          <Stack.Screen name="ProfilePreviewScreen" component={ProfilePreviewScreen} />
          <Stack.Screen name="FollowersFollowingScreen" component={FollowersFollowingScreen} />

        </Stack.Navigator>
      </NavigationContainer>

    </GestureHandlerRootView>

  );
}