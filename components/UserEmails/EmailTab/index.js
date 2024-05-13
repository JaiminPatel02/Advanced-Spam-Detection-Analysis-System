import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FetchEmails from "../FetchEmail"
import SpamEmails from "../SpamEmail"
import GenuineEmails from "../GenuineEmail"
import { View, Text, StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function SmsTab() {

  const getTabBarStyle = (isFocused, index) => {
    const colors = ['#ff0000', '#00ff00', '#0000ff']; // Define your colors for each tab
    const activeColor = colors[index % colors.length];
    const inactiveColor = 'gray';

    return {
      backgroundColor: isFocused ? activeColor : inactiveColor,
    };
  };

  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: [styles.tabLabel, styles.tabLabelCapitalized],
        tabBarIndicatorStyle: styles.tabIndicator,
        tabBarStyle: getTabBarStyle,
      })}
      >
        <Tab.Screen name="FetchEmails" component={FetchEmails}  options={{headerShown: false, title: 'Inbox'}} />
        <Tab.Screen name="SpamEmails" component={SpamEmails} options={{ headerShown: false, title: 'Spam Emails' }} />
      <Tab.Screen name="GenuineEmails" component={GenuineEmails} options={{ headerShown: false, title: 'Genuine Emails' }} />
      </Tab.Navigator>
  )
}



const styles = StyleSheet.create({
  tabBar: {
    height: 50, // Adjust the height of the tab bar if needed
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabLabelCapitalized: {
    textTransform: 'capitalize',
  },
  tabIndicator: {
    backgroundColor: 'blue',
    height: 3,
  },
});

export default SmsTab