import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, ScrollView, TextInput} from 'react-native';
import querystring from 'querystring';
import axios from 'axios';
import * as Progress from 'react-native-progress';
import CustomHeader from '../../components/CustomHeader';

const MyComponent = () => {
  const [analysisId, setAnalysisId] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const getProgressColor = riskscore => {
    const progressValue = (Math.floor(riskscore) * 2.5) / 10;
    if (progressValue >= 1) {
      return '#ff0000';
    } else if (progressValue >= 0.75) {
      return '#ff3232'; // Or any other lighter shade of red
    } else if (progressValue >= 0.5) {
      return '#CD5C5C'; // Or any other even lighter shade of red
    } else if (progressValue >= 0.25) {
      return '#ff4c4c'; // Or any other very light shade of red
    } else {
      return 'white'; // Or any other color you want for values below 0.25
    }
  };

  const fetchData = async () => {
    try {
      const params = querystring.stringify({
        url: url,
      });

      const options = {
        method: 'POST',
        url: 'https://www.virustotal.com/api/v3/urls',
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
          'x-apikey': '90875ec2809e3541ea34d58b31c6d237847c12075004890caafd5fc83cf804e6', // Replace with your actual API key
        },
        data: params,
      };

      const response = await axios.request(options);
      console.log(response.data.data.id);

      if (response.data && response.data.data.id) {
        setAnalysisId(response.data.data.id);
        console.log("hani")
        fetchAnalysisData(response.data.data.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAnalysisData = async (id) => {
    try {
      console.log(id , "new")
      const options = {
        method: 'GET',
        url: `https://www.virustotal.com/api/v3/analyses/${id}`,
        headers: {
          accept: 'application/json',
          'x-apikey': '90875ec2809e3541ea34d58b31c6d237847c12075004890caafd5fc83cf804e6', // Replace with your actual API key
        },
      };

      const response = await axios.request(options);
      console.log(response.data);
      setAnalysisData(response.data.data);
      console.log(response.data.data.attributes.results)

      const lol = response.data.data.attributes.results
      console.log(lol.len)
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    }
  };

  return (
    <>
  <CustomHeader title="Home" />
    <View style={styles.container}>
      <TextInput
        style={styles.fixedInput}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
      />
  
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchData}>
          <Text style={styles.buttonText}>Analyze URL</Text>
        </TouchableOpacity>
      </View>
  
  
      <ScrollView contentContainerStyle={styles.resultContainer}>
        {analysisData ? (
          <View>
          <Text style={styles.titleGreen}>Analysis Results</Text>

            {/* <Text>ID: {analysisData.id}</Text> */}
            <Text>Date: {new Date(analysisData.attributes.date * 1000).toLocaleString()}</Text>
            <Text>Status: {analysisData.attributes.status}</Text>
  
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Statistics:</Text>
              <Text style={styles.highlightedStat}>Harmless: {analysisData.attributes.stats.harmless}</Text>
              <Text style={styles.highlightedStat}>Malicious: {analysisData.attributes.stats.malicious}</Text>
              <Text style={styles.highlightedStat}>Suspicious: {analysisData.attributes.stats.suspicious}</Text>
              <Text style={styles.highlightedStat}>Undetected: {analysisData.attributes.stats.undetected}</Text>
            </View>
            <View>
            <View style={styles.riskScoreBox}>
  <Text style={styles.riskScoreText}>
    Risk score: {((analysisData.attributes.stats.malicious + analysisData.attributes.stats.suspicious) * 100) / 90} %
  </Text>
</View>

            </View>
  
            {/* <Text>Timeout: {analysisData.attributes.stats.timeout}</Text> */}
            <Text style={styles.titleGreen2}>Security vendors' analysis Results:</Text>
            

            <View style={styles.resultTable}>
  {Object.entries(analysisData.attributes.results).map(([engine, result]) => (
    <View key={engine} style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.boldBlackText}>{engine}:</Text>
      </View>
      <View style={styles.tableCell}>
        <Text>{result.category} - {result.result}</Text>
      </View>
    </View>
  ))}
</View>


          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </View>
    </>
  );
  

};

const styles = StyleSheet.create({
    resultTable: {
        marginTop: 10,
      },
      riskScoreBox: {
        backgroundColor: '#F0F0F0', // Background color of the box
        borderWidth: 1, // Add a border
        borderColor: 'black', // Border color
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        alignItems: 'center', // Center the content horizontally
      },
      riskScoreText: {
        color: 'red', // Text color
        fontWeight: 'bold',
        fontSize: 16,
      },
      titleGreen: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'green', // Add green color to the title
      },
      titleGreen2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop : 5,
        color: 'green', // Add green color to the title
      },
      tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      },
      tableCell: {
        flex: 1,
        paddingHorizontal: 5,
      },
      boldBlackText: {
        fontWeight: 'bold',
        color: 'black',
      },
    container: {
      flex: 1,
      backgroundColor: '#F0F0F0',
      padding: 20,
    },
    boldBlackText: {
        fontWeight: 'bold',
        color: 'black', // Use black color for the text
      },
    fixedInput: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333', // Use a darker color, you can adjust the color value as needed
        marginTop: 10,
        marginBottom: 5,
      },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Distribute space between buttons
    },
    button: {
      flex: 1,
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    analysisIdText: {
      marginTop: 10,
      fontSize: 16,
    },
    resultContainer: {
      paddingTop: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    statsContainer: {
      marginTop: 10,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    highlightedStat: {
      color: '#FF5733',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  



export default MyComponent;
