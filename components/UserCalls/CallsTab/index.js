import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import FetchCalls from "../FetchCalls"
import SpamCalls from "../SpamCalls"
import GenuineCalls from "../GenuineCalls"
import CustomHeader from '../../CustomHeader';
import {
  phoneThumb,
  Thumbnailiconspam,
  Trueicongenuine,
} from '../../../assets/SvgComponents';

const Tab = createMaterialTopTabNavigator();

const tabIcons = {
  'Call logs': phoneThumb,
  'Spam Calls': Thumbnailiconspam,
  'Genuine Calls': Trueicongenuine,
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

function CallsTab() {
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
      <Tab.Screen name="Call logs" component={FetchCalls}  options={{headerShown: false, title: 'Calllogs'}} />
        <Tab.Screen name="Spam Calls" component={SpamCalls} options={{ headerShown: false, title: 'SpamCalls' }} />
      <Tab.Screen name="Genuine Calls" component={GenuineCalls} options={{ headerShown: false, title: 'GenuineCalls' }} />
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

export default CallsTab;
