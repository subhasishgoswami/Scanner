import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, StatusBar } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Please Scan')
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data);
    setCopiedText(data);
  };

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    copyToClipboard(data);
    // console.log('Type: ' + type + '\nData: ' + data)
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for Camera Permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 800, width: 800 }} />
        </View>
        
        <View style={styles.result}>
          {copiedText &&(
            <Text onPress={() => copyToClipboard(text)} style={styles.maintext}>{text}</Text>
          )}
        </View>

        {scanned && (<Button title={'Scan again'} onPress={() => setScanned(false)} color='#146eb4' style/>)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B4B4B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    width: 300,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#146eb4',
    elevation: 5, 
  },
  result:{
    marginVertical:10,
    width:"auto",
    height:'auto',
    backgroundColor: 'white',
    elevation: 5, 
    borderRadius: 10,
    width:'75%',
    alignItems:'center'
  }
});