import React, {useEffect, useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeModules,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Apilayerapikey} from "../../ApiKeys"
import { SvgUri } from 'react-native-svg';
import {ProfileIcon} from "../../../assets/SvgComponents"
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallLogModule = NativeModules.CallLogModule;

const FetchCalls = () => {
  const [smsList, setSmsList] = useState([]);
  const [userMobileno, setUserMobileno] = useState();
  const [currentSmsCount, setCurrentSmsCount] = useState(0);
  const navigation = useNavigation();


useEffect(() =>{
  retrieveMessagesPeriodically();
}, [])

const storeDataLocally = async (key, value) => {
  try {
    if (typeof key !== 'string') {
      throw new Error('Key must be a valid string.');
    }
    await AsyncStorage.setItem(key, value);
    // console.log('Data stored successfully!');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

  const retrieveMessages = async () => {
    try {
      const smsArray = await CallLogModule.getCallLogs();
      const topSms = smsArray.slice(0, 10); 
      const mobileNumber = smsArray[0].userMobileNumber;
      setUserMobileno(mobileNumber);
      const key = "mmyUniqueKeyyUniqueKey"
      storeDataLocally(key, mobileNumber);
      setSmsList(topSms);
    } catch (error) {
      console.error(error);
    }
  };
  
  const retrieveMessagesPeriodically = async () => {
    try {
      await retrieveMessages();
      return new Promise(resolve => {
        setInterval(async () => {
          await retrieveMessages();
        }, 5000);
        resolve();
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };


  const testdata = [
    {
      sender: '918320921369',
    },
    {
      sender: '919409214307',
    },
    {
      sender: '111',
    },
    {
      sender: 'VM-BSELTD',
    },
    {
     sender: 'JUNLRY',
    },
  ];


  const fetchDataLN = () => {
    console.log("apikey", Apilayerapikey);
    const myHeaders = new Headers();
    const newuserMobileno = userMobileno;

    console.log("newuserMobileno" , newuserMobileno)
    myHeaders.append('apikey', `${Apilayerapikey}`);
  
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
  
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.apilayer.com/number_verification/validate?number=${newuserMobileno}`,
        requestOptions
      )
        .then(response => response.json())
        .then(result => {
          const data = {
            carrier: null,
            location: null,
          };
          console.log("reeeee" , result)
          if (result.location !== '' && result.carrier !== '') {
            data.location = result.location;
            data.carrier = result.carrier;
          } else {
            data.carrier = 'Default';
            data.location = 'Default';
          }
  
          resolve(data);
          console.log("blaA" , data)
        })
        .catch(error => {
          reject(error);
        });
    });
  }; 

  const fetchDataLNsender = sender => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('apikey', `${Apilayerapikey}`);
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };

      fetch(
        `https://api.apilayer.com/number_verification/validate?number=${sender}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          const data = {
            carrier: null,
            location: null,
          };
          if (result.location !== '' && result.carrier !== '') {
            data.location = result.location;
            data.carrier = result.carrier;
          } else {
            data.carrier = 'Default';
            data.location = 'Default';
          }

          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const fetchDataLNsenderNNcarrier = sender => {
    const senderfirstLetter = sender.charAt(0);
  
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
  
      fetch(
        `https://spam-backend.vercel.app/api/ServiceProvider/${senderfirstLetter}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log("API Response:", result); // Check the API response
          const data = {
            carrier: null,
          };
  
          if (result.ServiceProvidername !== '') {
            data.carrier = result[0].ServiceProvidername;
          } else {
            data.carrier = 'Default';
          }
  
          resolve(data);
        })
        .catch(error => {
          console.log("API Error:", error); // Check if there's any error in the API call
          reject(error);
        });
    });
  };

  
  const fetchDataLNsenderNNlocation = sender => {
    const senderfirstLetter = sender.charAt(1);
  
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
  
      fetch(
        `https://spam-backend.vercel.app/api/ServiceProviderState/${senderfirstLetter}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log("API Response:", result); // Check the API response
          const data = {
            location: null,
          };
  
          if (result.ServiceProviderstate !== '') {
            data.location = result[0].ServiceProviderstate;
          } else {
            data.location = 'Default';
          }
  console.log( "newdata", data)
          resolve(data);
        })
        .catch(error => {
          console.log("API Error:", error); // Check if there's any error in the API call
          reject(error);
        });
    });
  };
  const fetchDataLNsenderNNPrincipalEntity = sender => {
    const senderlastlatters = sender.slice(3).toUpperCase();
    console.log("senderlastlatters" , senderlastlatters)
  
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
  
      fetch(
        `https://spam-backend.vercel.app/api/PrincipalEntity/${senderlastlatters}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log("API Response:", result); 
          const data = {
            principalEntity: null,
          };
  
          if (result[0].PrincipalEntityName !== '') {
            data.principalEntity = result[0].PrincipalEntityName;
          } else {
            data.principalEntity = 'Default';
          }
  console.log( "newdata", data)
          resolve(data);
        })
        .catch(error => {
          console.log("API Error:", error); 
          reject(error);

        });
    });
  };
  const fetchDataLNsenderNNPrincipalEntityO = sender => {
    const senderlastlatters = sender.toUpperCase();
    console.log("senderlastlatters" , senderlastlatters)
  
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
  
      fetch(
        `https://spam-backend.vercel.app/api/PrincipalEntity/${senderlastlatters}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log("API Response:", result); // Check the API response
          const data = {
            principalEntity: null,
          };
  
          if (result[0].PrincipalEntityName !== '') {
            data.principalEntity = result[0].PrincipalEntityName;
          } else {
            data.principalEntity = 'Default';
          }
  console.log( "newdata", data)
          resolve(data);
        })
        .catch(error => {
          console.log("API Error:", error); // Check if there's any error in the API call
          reject(error);

        });
    });
  };


  const test = async () => {
    try {
      const carrierArray = [];
      const locationArray = [];
      const recivercarrierArray = [];
      const reciverlocationArray = [];
  
      const smsCount = smsList.length;
  
      const data = await fetchDataLN();
      if (data.carrier !== null) {
        recivercarrierArray.push(data.carrier);
      }
      if (data.location !== null) {
        reciverlocationArray.push(data.location);
      }
  
      for (let i = 0; i < smsCount; i++) {
        setCurrentSmsCount(i + 1);
        const sms = smsList[i];

          const data5 = await fetchDataLNsender(sms.sender);
          if (data5.carrier !== null) {
            carrierArray.push(data5.carrier);
          }
          if (data5.location !== null) {
            locationArray.push(data5.location);
          }
        
        console.log('Current SMS Count:', i + 1);
      }
  
      console.log('Carrier Array:', carrierArray);
      console.log('Location Array:', locationArray);
      console.log('Receiver Carrier Array:', recivercarrierArray);
      console.log('Receiver Location Array:', reciverlocationArray);
  
      console.log('SMS Sent Count:', smsCount); // Display the final count in the console
      console.log('rLRS:', recivercarrierArray , reciverlocationArray); // Display the final count in the console
      // Alert.alert('Done', `Done. SMS Sent Count: ${smsCount}`); // Show the final count in the 'Done' alert message
      await sendSmsDataToApi(carrierArray , locationArray , recivercarrierArray , reciverlocationArray);
    } catch (error) {
      console.log('Error fetching data calls:', error);
      Alert.alert('Error', error.message);
    }
  };
  
  

  const sendSmsDataToApi = async (carrierArray , locationArray  , recivercarrierArray , reciverlocationArray) => {
    try {
      const dataToSend = smsList.slice(0, 10).map((sms, index) => ({
        ...sms,
        receiverlocation: reciverlocationArray[0],
        receivercarrier: recivercarrierArray[0],
        sendercarrier: carrierArray[index % carrierArray.length],
        senderlocation: locationArray[index % locationArray.length],
      }));
  
      console.log('Sending SMS to API:', dataToSend);
  
      const response = await fetch('https://smsapi-tko7.onrender.com/calldata', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      const responseData = await response.json();
      console.log('API response:', responseData);
  
      Alert.alert('Done', 'Fetch successfully!', [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Sorry', 'Something went wrong', [
        { text: 'OK'},
      ]);
    }
  };

  return (
    <>
      <View style={styles.container}>
      <View style={styles.container2}>
      <TouchableOpacity style={styles.button} onPress={test}>
        <Text style={styles.buttonText}>Check Spam Calls</Text>
      </TouchableOpacity>
    </View>
        <Text style={{ textAlign: 'center' }}>
          Retrieved Calls :- {currentSmsCount * 10} %
        </Text>
        <ScrollView style={styles.container}>
          {smsList.slice(0, 10).map((sms, index) => (
            <View key={index} style={styles.messageBox}>
              <View style={styles.profileIcon}>
                <ProfileIcon height={57} width={57} />
              </View>
              <View style={styles.messageContent}>
                <View style={styles.dateAndTime}>
                  <Text style={styles.dateText}>{sms.date}</Text>
                  <Text style={styles.timeText}>{sms.time}</Text>
                </View>
                <Text style={styles.senderNumber}>{sms.sender}</Text>
                <Text style={styles.messageText}>Type:
            {sms.type === 1
              ? 'Incoming'
              : sms.type === 2
              ? 'Outgoing'
              : 'Missed'}
              </Text>
                <Text style={styles.messageText}>Call Duration - {sms.duration} sec 
              </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};



const styles = StyleSheet.create({
  container2: {
    marginTop : 20,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  container: {
    backgroundColor : "#dcddde"
  },
  button: {
    backgroundColor: '#22A7F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageBox: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 0.7,
    borderColor: 'black',
    marginBottom: 7,
    marginLeft: 10,
    marginRight: 10,
    borderRadius :10,
    backgroundColor: "white",
  },
  profileIcon: {
    marginRight: 10,
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
  },
  dateAndTime: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    marginRight: 5,
  },
  timeText: {
    fontSize: 12,
  },
  senderNumber: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
    position:"absolute"
  },
  messageText: {
    textAlign: 'left',
    marginTop :7
  },
});



export default FetchCalls;
