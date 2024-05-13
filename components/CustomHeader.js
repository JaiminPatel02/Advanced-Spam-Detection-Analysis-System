import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  Kavachlogo,
  Crossicon,
  ProfileIcon,
  MessagesIcon,
} from '../assets/SvgComponents';

const CustomHeader = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <Kavachlogo height={60} width={40}/>
        <Text style={styles.headerTitle}>Kavach</Text>
      </View>
      <View style={styles.rightContainer}>
        <ProfileIcon height={60} width={40}/>
        {/* Add any other icons or elements for the right side */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF', // Your header background color
    height: 60, // Set the desired height for the header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row-reverse', // Reverses the order of elements
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'CustomFont', // Use the custom font
    marginLeft: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomHeader;
