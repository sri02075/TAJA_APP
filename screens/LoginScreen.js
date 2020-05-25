import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Input , Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.title_area}>
        <Text styles={styles.text_title}>반갑습니다 :)</Text>
        <Text styles={styles.text_title}>안양 택시</Text>
        <Text styles={styles.text_title}>같이 탈래요?</Text>
      </View>
      <View style={styles.input_area}></View>
      <View style={styles.button_area}></View>
    </View>
  );
}

LoginScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title_area : {
    flex : 8,
    backgroundColor : "red",
    justifyContent : "center",
    alignItems : "flex-start",
    paddingLeft : "10%"
  },
  input_area : {
    flex : 5,
    backgroundColor : "blue"
  },
  button_area : {
    flex : 6,
    backgroundColor : "yellow"
  }
});
