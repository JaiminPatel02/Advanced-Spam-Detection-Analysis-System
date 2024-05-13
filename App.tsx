import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SmsTab from './components/UserSMS/SmsTab';
import CallsTab from './components/UserCalls/CallsTab';
import EmailTab from './components/UserEmails/EmailTab';
import OthersTab from './components/UserOthers/OthersTab';
import {PermissionsAndroid} from 'react-native';
import {MessagesIcon, CallIcon , EmailIcon , OtherIcon , LinkIcon} from './assets/SvgComponents';
import Tool  from "./components/UserSMS/tool"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const readSmsGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      if (readSmsGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Read SMS permission granted');
      } else {
        console.log('Read SMS permission denied');
      }

      const readCallLogGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      );
      if (readCallLogGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Read call log permission granted');
      } else {
        console.log('Read call log permission denied');
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NavigationContainer >
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#22A7F0', 
            tabBarInactiveTintColor: 'gray', 
          }}>
          <Tab.Screen
            name="SmsTab"
            component={SmsTab}
            options={{
              headerShown: false,
              title: 'Messages',
              tabBarIcon: ({color, size}) => (
                <MessagesIcon height={27} width={27} fill={color} />
              ),
              tabBarLabelStyle: {
                color: 'black',
                fontWeight : "bold" // Change the color of the tab title here
              },
            }}
          />
          <Tab.Screen
            name="CallsTab"
            component={CallsTab}
            options={{
              headerShown: false,
              title: 'Calls',
              tabBarIcon: ({color, size}) => (
                <CallIcon height={27} width={27} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="EmailTab"
            component={EmailTab}
            options={{headerShown: true, title: 'Emails' , 
            tabBarIcon: ({color, size}) => (
              <EmailIcon height={23} width={23} color={color} />
            ),
          }}
          />
          <Tab.Screen
            name="OthersTab"
            component={OthersTab}
            options={{headerShown: true, title: 'Others' ,
            tabBarIcon: ({color, size}) => (
              <OtherIcon height={27} width={27} color={color} />
            ),
          }}
          />
          <Tab.Screen
            name="Links"
            component={Tool}
            options={{headerShown: false, title: 'Links' ,
            tabBarIcon: ({color, size}) => (
              <LinkIcon height={27} width={27} color={color} />
            ),
          }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
