import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import {NativeModules} from 'react-native';
import {Apilayerapikey} from "../../ApiKeys"
import {useNavigation} from '@react-navigation/native';

const CallLogModule = NativeModules.CallLogModule;

const FetchCalls = () => {
  const [callLogList, setCallLogList] = useState([]);
  const [userMobileno, setUserMobileno] = useState();
  const [recivercarrier, setReciverCarrier] = useState([]);
  const [reciverlocation, setReciverLocation] = useState([]);
  const [senderlocationArray, setSenderLocationArray] = useState([]);
  const [sendercarrierArray, setSenderCarrierArray] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    // retrieveCallsPeriodically();
    retrieveuserMobileno()
    retrieveCallLogs()
    // test()
  }, []);

  // const retrieveCallsPeriodically = () => {
  //   retrieveCallLogs();
  //   setInterval(retrieveCallLogs, 5000);
  // };


  const retrieveCallLogs = async () => {
    CallLogModule.getCallLogs()
    .then(callLogsArray => {
      const filteredCalls = callLogsArray.filter(
        item => item.type === 1 || item.type === 5,
      );
      const topCalls = callLogsArray.slice(0, 50);
      setCallLogList(filteredCalls);
    });
  };

  const retrieveuserMobileno = () => {
    CallLogModule.getCallLogs()
      .then(callLogsArray => {
        const mobileNumber = callLogsArray[0].userMobileNumber;
        const formattedMobileNumber = mobileNumber.startsWith('+')
          ? mobileNumber.slice(1) // Remove the '+' sign
          : mobileNumber;

        setUserMobileno(formattedMobileNumber);
        console.log("hey" ,formattedMobileNumber);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const test = async () => {
    const recivercarrierArray = []
    const reciverlocationArray = []
    
    const data = await fetchDataLN();
      if (data.carrier !== null) {
      recivercarrierArray.push(data.carrier);
      }
      if (data.location !== null) {
      reciverlocationArray.push(data.location);
      }

    try {
      const carrierArray = [];
      const locationArray = [];
  
      for (const calls of callLogList) {
          const data = await fetchDataLNsender(calls.number);
          if (data.carrier !== null) {
            carrierArray.push(data.carrier);
          }
          if (data.location !== null) {
            locationArray.push(data.location);
          }
        }
      
  
      console.log('Carrier Array:', carrierArray);
      console.log('Location Array:', locationArray);
      console.log("recivercarrierArray:-" , recivercarrierArray , "reciverlocationArray:-" , reciverlocationArray )
  
      setSenderCarrierArray(carrierArray);
      setSenderLocationArray(locationArray);
  
      Alert.alert('Done', 'Done');
    } catch (error) {
      console.log('Error fetching data:', error);
      Alert.alert('Error', error.message);
    }


    setReciverCarrier(recivercarrierArray)
    setReciverLocation(reciverlocationArray)
  };


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

  const fetchDataLNsender = number => {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('apikey', `${Apilayerapikey}`);
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };

      fetch(
        `https://api.apilayer.com/number_verification/validate?number=${number}`,
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


  const sendSmsDataToApi = () => {
 
    const dataToSend = callLogList.slice(0, 50).map((calls, index) => ({
      ...calls,
      reciverlocation: reciverlocation[0],
      recivercarrier: recivercarrier[0],
      sendercarrier: sendercarrierArray[index % sendercarrierArray.length],
      senderlocation: senderlocationArray[index % senderlocationArray.length],
      
    }));
    // console.log(sendercarrier)
    console.log('Sending SMS to API:', dataToSend);

    fetch('https://spam-backend.vercel.app/api/sms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then(response => {
        // console.log('Response:', response);
        return response.json();
      })
      .then(responseData => {
        console.log('API response:', responseData);
        Alert.alert('Done', 'Send successfully!', [
          {text: 'OK', onPress: () => navigation.navigate('NewScreenCall')},
        ]);
      })
      .catch(error => {
        console.error('API error:', error);
        Alert.alert('Sorry', 'Something went wrong', [
          {text: 'OK', onPress: () => navigation.navigate('NewScreenCall')},
        ]);
      });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Call Logs:</Text>
      <Button onPress={test} title="get details" />
      <Button onPress={sendSmsDataToApi} title="Check Spam Messages" />
      <Button onPress={() => navigation.navigate('NewScreencall')} title='next' />
      {callLogList.slice(0 ,50).map((item, index) => (
        <View key={index} style={styles.callLogItem}>
          <Text style={styles.callLogItemText}>{index + 1}</Text>
          <Text style={styles.callLogItemText}>Number: {item.number}</Text>
          <Text style={styles.callLogItemText}>Date: {item.date}</Text>
          <Text style={styles.callLogItemText}>Time: {item.time}</Text>
          <Text style={styles.callLogItemText}>
            Duration: {item.duration} seconds
          </Text>
          <Text style={styles.callLogItemText}>userMobileNumber: {item.userMobileNumber} </Text>
          <Text style={styles.callLogItemText}>
            Type:{' '}
            {item.type === 1
              ? 'Incoming'
              : item.type === 2
              ? 'Outgoing'
              : 'Missed'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  callLogItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  callLogItemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FetchCalls;
