import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import {
  ThumInbocicon,
  Thumbnailiconspam,
  Trueicongenuine,
} from '../../../assets/SvgComponents';

import FetchSMS from '../FetchSMS/index';
import SpamSMS from '../SpamSMS/index';
import GenuineSMS from '../GenuineSMS/index';
import CustomHeader from '../../CustomHeader';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

// Define an array of SVG components for each tab
const tabIcons = {
  'Inbox': ThumInbocicon,
  'Spam Messages': Thumbnailiconspam,
  'Genuine Messages': Trueicongenuine,
};

function TabLabel({ title, focused, icon }) {
  const Icon = icon; // Get the SVG component from the array
  return (
    <View style={styles.tabLabelContainer}>
      <Icon height={27} width={17} style={styles.icon} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{title}</Text>
    </View>
  );
}

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
    <>
      <CustomHeader title="Home" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#22A7F0',
          tabBarInactiveTintColor: 'black',
          tabBarLabelStyle: [styles.tabLabel, styles.tabLabelCapitalized],
          tabBarIndicatorStyle: { backgroundColor: '#22A7F0' },
          tabBarStyle: getTabBarStyle,
          tabBarLabel: ({ focused, color, size }) => {
            const { name } = route;
            return <TabLabel title={name} focused={focused} icon={tabIcons[name]} />;
          },
        })}
      >
        <Tab.Screen name="Inbox" component={FetchSMS} options={{ headerShown: false, title: 'Inbox' }} />
        <Tab.Screen name="Spam Messages" component={SpamSMS} options={{ headerShown: false, title: 'Spam Messages' }} />
        <Tab.Screen name="Genuine Messages" component={GenuineSMS} options={{ headerShown: false, title: 'Genuine Messages' }} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 50, // Adjust the height of the tab bar if needed
  },
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabLabelFocused: {
    color: '#22A7F0',
  },
  tabLabelCapitalized: {
    textTransform: 'capitalize',
  },
});

export default SmsTab;
