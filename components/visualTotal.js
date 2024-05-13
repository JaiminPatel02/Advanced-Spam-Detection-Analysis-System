import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, ScrollView, TextInput} from 'react-native';
import querystring from 'querystring';
import axios from 'axios';

const MyComponent = () => {
  const [analysisId, setAnalysisId] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    }
  };

  return (
    <>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>VirusTotal Analysis ID:</Text>
      <Text style={{ fontSize: 18 }}>{analysisId}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
      />

      <TouchableOpacity style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>Analyze URL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 20,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: '#007bff',
          borderRadius: 5,
        }}
        onPress={fetchData}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Check Analysis</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 20,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: '#007bff',
          borderRadius: 5,
        }}
        onPress={fetchAnalysisData}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>hahah</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.container}>
      {analysisData ? (
         <ScrollView>
        <View>
          <Text style={styles.title}>Analysis Results</Text>
          <Text>ID: {analysisData.id}</Text>
          <Text>Date: {new Date(analysisData.attributes.date * 1000).toLocaleString()}</Text>
          <Text>Status: {analysisData.attributes.status}</Text>
          <Text>Statistics:</Text>
          <Text>Harmless: {analysisData.attributes.stats.harmless}</Text>
          <Text>Malicious: {analysisData.attributes.stats.malicious}</Text>
          <Text>Suspicious: {analysisData.attributes.stats.suspicious}</Text>
          <Text>Undetected: {analysisData.attributes.stats.undetected}</Text>
          <Text>Timeout: {analysisData.attributes.stats.timeout}</Text>
          <Text>Results:</Text>
          {Object.entries(analysisData.attributes.results).map(([engine, result]) => (
            <Text key={engine}>{engine}: {result.category} - {result.result}</Text>
          ))}
        </View>
         </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
export default MyComponent;
