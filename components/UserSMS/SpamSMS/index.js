import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import * as Progress from 'react-native-progress';
import {
  ProfileIcon,
  Crossicon,
  MessagesIcon,
} from '../../../assets/SvgComponents';

const SmsModule = NativeModules.SmsModule;

const SpamSMS = () => {
  const [data, setData] = useState([]);
  const [datalenngth, setDatalength] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userMobileno, setUserMobileno] = useState();
  const [urll, setUrll] = useState('');
  const [selectedValue, setSelectedValue] = useState('spam');

  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [selectedFeedbackOption, setSelectedFeedbackOption] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSendFeedbackButton, setShowSendFeedbackButton] = useState(false);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedValue]);

  const onMessageButtonClick = item => {
    console.log('Hello');
    setSelectedMessage(item);
    setShowPopup(true);
    setShowSendFeedbackButton(false);
  };
  const onFeedbackButtonClick = item => {
    console.log('Hello');
    setSelectedFeedback(item);
    setShowPopup2(true);
  };

  const handleYesClick = () => {
    setShowPopup2(false);
    console.log(selectedFeedback.id , "id") 
    sendFeedbackToApi(selectedFeedback.id, true); // Assuming "true" means user confirmed as true
  };

  const handleNoClick = () => {
    setShowDropdown(true);
    setShowSendFeedbackButton(true);
  };

  const handleDropdownChange = value => {
    setSelectedFeedbackOption(value);
    if (value) {
      setShowSendFeedbackButton(true);
    } else {
      setShowSendFeedbackButton(false);
    }
  };

  const dropdownOptions = [
    {label: 'Select Category', value: 'spam'},
    {label: 'Fraud', value: 'fraud'},
    {label: 'Phishing', value: 'phishing'},
    {label: 'Financial', value: 'financial'},
    {label: 'Promotional', value: 'promotional'},
  ];

  const getProgressColor = riskscore => {
    const progressValue = (Math.floor(riskscore) * 2.5) / 10;
    if (progressValue >= 1) {
      return '#ff2424';
    } else if (progressValue >= 0.75) {
      return '#ff3b3b'; // Or any other lighter shade of red
    } else if (progressValue >= 0.5) {
      return '#fa4b4b'; // Or any other even lighter shade of red
    } else if (progressValue >= 0.25) {
      return '#ff8f8f'; // Or any other very light shade of red
    } else {
      return 'white'; // Or any other color you want for values below 0.25
    }
  };

  const retrieveDataLocally = async key => {
    try {
      if (typeof key !== 'string') {
        throw new Error('Key must be a valid string.');
      }
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setUserMobileno(value);
        return value;
      } else {
        console.log('Data not found for the key:', key);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const userMobileno = await retrieveDataLocally(key);
      if (!userMobileno) {
        console.log('User mobile number not found in local storage.');
        return; // If userMobileno is not found, don't proceed with fetching data
      }

      const url = `https://smsapi-tko7.onrender.com/${userMobileno}/${selectedValue}`;

      // console.log('URL:', url);
      setUrll(url);

      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      setData(jsonData);
      setDatalength(jsonData.length);
      // console.log(jsonData.length);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const key = 'mmyUniqueKeyyUniqueKey';

  const sendFeedbackToApi = async (smsId, feedback) => {
    try {

      const feedbackData = [
        {
          feedback: feedback,
        },
      ];
      console.log(smsId , feedback)
      const response = await fetch(`https://smsapi-tko7.onrender.com/data/${smsId}/feedback`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      console.log(response)

      // if (!response.ok) {
      //   throw new Error('Failed to send feedback');
      // }

      console.log('Feedback sent successfully');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={itemValue => setSelectedValue(itemValue)}
            style={styles.picker}>
            {dropdownOptions.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
          {/* <Text style={styles.selectedValueText}>You selected: {selectedValue}</Text> */}
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={styles.loader}
            />
          ) : (
            data.map((item, index) => (
              <>
                <View key={index} style={styles.messageBox}>
                  <View style={styles.profileIcon}>
                    <ProfileIcon height={57} width={57} />
                  </View>
                  <View style={styles.messageContent}>
                    <View style={styles.dateAndTime}>
                      <Text style={styles.dateText}>{item.date}</Text>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <Text style={styles.senderNumber}>{item.sender}</Text>
                    <Text
                      numberOfLines={3}
                      ellipsizeMode="tail"
                      style={styles.messageText}>
                      {item.message}
                    </Text>
                    <View>
                      <Text style={styles.progressTexttitle}>Risk Score</Text>
                      <View style={styles.progressBarContainer}>
                        <Progress.Bar
                          progress={(Math.floor(item.riskscore) * 2.5) / 10}
                          width={300}
                          height={15}
                          showsText={false}
                          borderColor="black"
                          color={getProgressColor(item.riskscore)}
                          style={styles.progressBar}
                        />
                        <Text style={styles.progressText}>{`${(
                          item.riskscore * 25
                        ).toFixed(0)}%`}</Text>
                      </View>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => onMessageButtonClick(item)}>
                        <Text style={styles.buttonText}>View Message</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => onFeedbackButtonClick(item)}>
                        <Text style={styles.buttonText}>Feedback</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            ))
          )}
        </ScrollView>
      </View>

      {showPopup && selectedMessage && (
        <View style={styles.popupContainer}>
          <View
            style={styles.popupBackground}
            onPress={() => setShowPopup(false)}
          />
          <View style={styles.popupContent}>
            <Crossicon
              style={styles.Crossicon}
              height={14}
              width={14}
              onPress={() => setShowPopup(false)}
            />
            <Text style={styles.senderText}>
              <Text style={styles.popuptitles}>Sender :</Text>
              {selectedMessage.sender}
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Date & Time :</Text>
              {selectedMessage.date} {selectedMessage.time}
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Message: </Text>
              {selectedMessage.message}
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Sender Location :</Text>
              {selectedMessage.senderlocation}
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Sender Carrier :</Text>
              {selectedMessage.sendercarrier}
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Principal Entity Name :</Text>
              {selectedMessage.principalentityname}
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Category : {selectedMessage.prediction}</Text>
            </Text>
            <Text style={styles.popupMessageText}>
              <Text style={styles.popuptitles}>Risk score :</Text>
            </Text>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                progress={(Math.floor(selectedMessage.riskscore) * 2.5) / 10}
                width={300}
                height={15}
                showsText={false}
                borderColor="black"
                color={getProgressColor(selectedMessage.riskscore)}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>{`${(
                selectedMessage.riskscore * 25
              ).toFixed(0)}%`}</Text>
            </View>
          </View>
        </View>
      )}

      {showPopup2 && selectedFeedback && (
        <View style={styles.popupContainer}>
          <View
            style={styles.popupBackground}
            onPress={() => setShowPopup2(false)}
          />
          <View style={styles.popupContent}>
            <Crossicon
              style={styles.Crossicon}
              height={14}
              width={14}
              onPress={() => setShowPopup2(false)}
            />
            <Text style={styles.FeedbacktitleText}>
              Is it True? Its {selectedFeedback.message} Message?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleYesClick}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleNoClick}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
            {showDropdown && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedFeedbackOption}
                  onValueChange={handleDropdownChange}
                  mode="dropdown">
                  <Picker.Item label="Select Category" value="" />
                  <Picker.Item label="ham" value="ham" />
                  <Picker.Item label="promotional" value="promotional" />
                  <Picker.Item label="financial" value="financial" />
                  <Picker.Item label="fraud" value="fraud" />
                  <Picker.Item label="phising" value="phising" />
                  {/* Add more options as needed */}
                </Picker>
              </View>
            )}
            {showSendFeedbackButton && (
              <TouchableOpacity
                style={styles.sendFeedbackButton}
                onPress={() => {
                  sendFeedbackToApi(
                    selectedFeedback.id,
                    selectedFeedbackOption,
                  );
                  setShowPopup2(false);
                  setShowDropdown(false);
                  setSelectedFeedbackOption('');
                  setShowSendFeedbackButton(false);
                }}>
                <Text style={styles.sendFeedbackButtonText}>Send Feedback</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  Crossicon: {
    position: 'absolute',
    top: 12,
    right: 15,
  },
  progressText: {
    color: 'black',
    fontWeight: 'bold',
  },
  popuptitles: {
    color: 'black',
    fontWeight: 'bold',
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxWidth: '90%',
  },
  popupMessageText: {
    marginBottom: 10,
    textAlign: 'left',
  },
  senderText: {
    marginBottom: 10,
    textAlign: 'left',
  },
  container2: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#dcddde',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#22A7F0',
    borderRadius: 100,
    paddingVertical: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'black',
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
    borderRadius: 10,
    backgroundColor: '#fcba81',
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
    position: 'absolute',
    color: 'black',
  },
  messageText: {
    textAlign: 'left',
    marginTop: 7,
    maxHeight: 60, // Set a maximum height for the message text
    overflow: 'hidden',
    color: 'black',
  },
  progressBarContainer: {
    width: 300,
    height: 15,
    position: 'relative',
    marginBottom: 10,
  },
  progressBar: {
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: '50%', // Center the text horizontally
    transform: [{translateX: -15}], // Adjust to center the text accurately
    color: 'black',
    fontWeight: '500',
  },
  pickerContainer: {
    borderColor: 'black', // Set border color to red
    backgroundColor: '#22A7F0',
    borderWidth: 1,
    borderRadius: 10,
    width: 200,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bolder',
    marginBottom: 5,
  },

  picker: {
    color: 'black',
  },

  selectedValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  FeedbacktitleText: {
    fontWeight: 'bold',
    color: 'black',
  },
  dropdown: {
    marginTop: 10,
    width: 150,
  },
  sendFeedbackButton: {
    backgroundColor: '#FF4500', // Custom background color (e.g., orange-red)
    borderRadius: 8, // Custom border radius
    paddingVertical: 12, // Custom padding
    paddingHorizontal: 20, // Custom padding
    marginTop: 10, // Custom margin top
    alignItems: 'center', // Center the text horizontally
  },
  sendFeedbackButtonText: {
    color: 'white', // Custom text color
    fontSize: 16, // Custom font size
    fontWeight: 'bold', // Custom font weight
  },
});

export default SpamSMS;
