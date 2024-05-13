import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const DropdownWithInput = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  const [spamornotsms, Setspamornotsms] = useState('');
  const [numberspamornot, setNumberspamornot] = useState('');

  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue);
    setInputValue('');
    setSubmittedValue('');
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSubmitSMS = async () => {
    if (!inputValue) return;

    try {
      const dataToSend = [{
        message: inputValue,
      }];
     

      const response = await axios.post('https://smsapi-tko7.onrender.com/data', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },

        
      });

      
      setSubmittedValue(inputValue); // Store submitted value for display
      setInputValue(''); // Clear input field
      console.log('SMS API response:', response.data);
      Setspamornotsms(response.data[0].prediction)
      console.log(response.data[0].prediction)
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  const handleSubmitNumber = async () => {
    if (!inputValue) return;

    try {
      const dataToSend = [{
        sender: inputValue,
      }];

      const response = await axios.post('https://smsapi-tko7.onrender.com/calldata', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
console.log(response)
      setSubmittedValue(inputValue); // Store submitted value for display
      setInputValue(''); // Clear input field
      setNumberspamornot(response.data[0].prediction)
      console.log('Number API response:', response.data);
    } catch (error) {
      console.error('Error sending number:', error);
    }
  };

  const handleSubmitLink = async () => {
    if (!inputValue) return;

    try {
      const response = await axios.post(
        'https://api-for-links.example.com',
        { link: inputValue },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSubmittedValue(inputValue); // Store submitted value for display
      setInputValue(''); // Clear input field
      console.log('Link API response:', response.data);
    } catch (error) {
      console.error('Error sending link:', error);
    }
  };

  const handleSubmitEmail = async () => {
    if (!inputValue) return;

    try {
      const dataToSend = [{
        message: inputValue,
      }];

      const response = await axios.post('https://smsapi-tko7.onrender.com/data', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmittedValue(inputValue); // Store submitted value for display
      setInputValue(''); // Clear input field
      console.log('Email API response:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select an option:</Text>
      <Picker
        selectedValue={selectedOption}
        onValueChange={handleOptionChange}
        style={styles.picker}
      >
        <Picker.Item label="Select an option" value="" />
        <Picker.Item label="Send SMS" value="sms" />
        <Picker.Item label="Send Number" value="number" />
        <Picker.Item label="Send Link" value="link" />
        <Picker.Item label="Send Email" value="email" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder={selectedOption === 'number' ? 'Enter a number' : `Enter ${selectedOption}`}
        keyboardType={selectedOption === 'number' ? 'numeric' : 'default'}
        value={inputValue}
        onChangeText={handleInputChange}
      />
      <Text>{spamornotsms} {numberspamornot}</Text>
      {selectedOption === 'sms' ? (
        <Button
          title="Send SMS"
          onPress={handleSubmitSMS}
          disabled={!inputValue}
        />
      ) : selectedOption === 'number' ? (
        <Button
          title="Send Number"
          onPress={handleSubmitNumber}
          disabled={!inputValue}
        />
      ) : selectedOption === 'link' ? (
        <Button
          title="Send Link"
          onPress={handleSubmitLink}
          disabled={!inputValue}
        />
      ) : selectedOption === 'email' ? (
        <Button
          title="Send Email"
          onPress={handleSubmitEmail}
          disabled={!inputValue}
        />
      ) : null}

      {submittedValue ? (
        <Text>Submitted Value: {submittedValue}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: 200,
    height: 50,
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default DropdownWithInput;
