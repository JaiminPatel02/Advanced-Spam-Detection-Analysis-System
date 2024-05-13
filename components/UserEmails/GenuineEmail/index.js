import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import {
  ProfileIcon,
  Crossicon,
  MessagesIcon,
} from '../../../assets/SvgComponents';

const GenuineEmail = () => {
  const [messages, setMessages] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // 5000 milliseconds = 5 seconds
  
    // Cleanup function to clear the interval when the component unmounts or when the dependency array changes
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchData = async () => {
    try {
      
      const response = await fetch('https://20a0-103-148-1-124.ngrok-free.app/view_emails/ham');
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setMessages(data);
      } else {
        const textData = await response.text();
        console.log('Non-JSON response:', textData);
        // Handle non-JSON response here as needed
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEmailPress = (email) => {
    setSelectedEmail(email);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedEmail(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {messages.map((message, index) => (
          <TouchableOpacity key={index} onPress={() => handleEmailPress(message)}>
            <View style={styles.messageContainer}>
              <Text style={styles.senderText}>{message.sender}</Text>
              <Text style={styles.subjectText}>{message.subject}</Text>
              <Text style={styles.dateText}>{message.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Crossicon
              style={styles.Crossicon}
              height={14}
              width={14}
            />
              </TouchableOpacity>
              {selectedEmail && (
                <>
                  <Text style={styles.modalSender}>{selectedEmail.sender}</Text>
                  <Text style={styles.modalSubject}>{selectedEmail.subject}</Text>
                  <Text style={styles.modalDate}>{selectedEmail.date}</Text>
                  <ScrollView style={styles.modalBody}>
                    <Text>{selectedEmail.email_body}</Text>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  senderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    maxWidth: '90%',
  },
  modalSender: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 14,
    color: '#333',
  },
});

export default GenuineEmail;
