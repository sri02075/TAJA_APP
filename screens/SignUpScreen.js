import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Input , Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

export default function SIgnupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}></View>
      <View style={styles.signUp_area}>
        <Text style={styles.text_signUp}>SIGN UP</Text>
      </View>
      <View style={styles.input_area}>
        <Input
          containerStyle={styles.input}
          placeholder='Email Address'
          errorStyle={{ color: 'red' }}
          errorMessage='ENTER A VALID ERROR HERE'
        />
        <Input
          containerStyle={styles.input}
          placeholder='Password'
          errorStyle={{ color: 'red' }}
          errorMessage='ENTER A VALID ERROR HERE'
        />
        <Input
          containerStyle={styles.input}
          placeholder='Confirm Password'
          errorStyle={{ color: 'red' }}
          errorMessage='ENTER A VALID ERROR HERE'
        />
      </View>
      <View style={styles.button_area}>
        <Button
          buttonStyle={styles.button}
          title="SIGN UP"
        />
      </View>
      <View style={styles.forgotPassword_area}>
        <Text style={styles.text_forgotPassword}>이미 계정이 있으신가요?</Text> 
         <Text>SIGN_IN.</Text>
      </View>
    </View>
  );
}

SIgnupScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logo : {
    flex: 4,
    backgroundColor : "red",
  },
  signUp_area : {
    flex: 4,
    backgroundColor : "blue",
    justifyContent : "center",
    alignItems : "center"
  },
  input_area : {
    flex: 5,
    backgroundColor : "white",
    alignItems : "center",
    paddingLeft : "14.35%",
    paddingRight : "14.35%",
  },
  button_area : {
    flex: 2,
    backgroundColor : "yellow",
    paddingLeft : "14.35%",
    paddingRight : "14.35%",
  },
  forgotPassword_area : {
    flex: 4,
    backgroundColor : "purple",
    justifyContent : "center",
    flexDirection : "row",
  },
  text_forgotPassword : {
    color : "white",
    fontSize : RFPercentage(2),
  },
  text_signUp : {
    fontSize : RFPercentage(4),
    color : "yellow",
  },
  input : {
    width : "100%",
  },
  button : {
    height : "90%",
    borderRadius : 8,
  }
});
