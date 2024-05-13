import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FetchOthers from "../FetchOthers"
import SpamOthers from "../SpamOthers"
import GenuineOthers from "../GenuineOthers"

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function Tool() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="FetchOthers" component={FetchOthers}  options={{headerShown: false, title: 'Rakshak1'}} />
        <Stack.Screen name="NewScreenOther" component={NewScreenOther} options={{ headerShown: false ,  title: 'Rakshak2' }} />
      </Stack.Navigator>
  )
}

function NewScreenOther() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="SpamOthers" component={SpamOthers} options={{ headerShown: false, title: 'SpamOthers' }} />
      <Tab.Screen name="GenuineOthers" component={GenuineOthers} options={{ headerShown: false, title: 'GenuineOthers' }} />
    </Tab.Navigator>
  );
}


export default Tool