import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        formData: {
        },
        appearKeyboard  : false,
    }
    
  }
  render(){
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
              
          <TouchableOpacity>
            
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row : {
    height : 80,
    backgroundColor : 'red',
  }
});
