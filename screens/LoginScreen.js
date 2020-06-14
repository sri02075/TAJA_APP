import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Input , Button, withTheme } from 'react-native-elements';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image
          source={require('../assets/images/taja_logo.png')}
          style={styles.logo_img}
        />
      <View style={styles.title_area}>
        <Text style={styles.text_title}>반갑습니다 :)</Text>
        <Text style={styles.text_title}>안양 택시</Text>
        <Text style={styles.text_title}>같이 탈래요?</Text>
      </View>
      <View style={styles.input_area}>
        <View style={styles.input_wrapper}>
          <Input
              containerStyle={styles.input_container}
              inputStyle = {styles.input}
              placeholder='Email Address'
              placeholderTextColor="#fff" 
              errorStyle={{ color: 'red' }}
              leftIcon={{ type: 'font-awesome', name: 'envelope', color : 'white' }}
              errorMessage=''
            />
            <Input
              containerStyle={styles.input_container}
              inputStyle = {styles.input}
              placeholder='Password'
              placeholderTextColor="#fff"
              errorStyle={{ color: 'red' }}
              leftIcon={{ type: 'font-awesome', name: 'lock',color : 'white' }}
              errorMessage=''
            />
          </View>
          <View style={styles.help_wrapper}>
            <View style={styles.help_create}>
              <Text style={styles.text_help}>계정을 생성하시겠어요?</Text>
            </View>
            <View style={styles.help_forgot}>
              <Text style={styles.text_help}>비밀번호를 잊으셨나요?</Text>
            </View>
          </View>
      </View>
      <View style={styles.button_area}>
      <Button
          buttonStyle={styles.button}
          title="SIGN IN"
          titleStyle = {{color : 'black',fontWeight : 'bold'}}
        />
      </View>
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
    /* backgroundColor : "red", */
    justifyContent : "flex-end",
    paddingBottom : "4%",
    alignItems : "flex-start",
    paddingLeft : "14.35%"
  },
  input_area : {
    flex : 5,
    /* backgroundColor : "blue", */
    paddingLeft : "14.35%",
    paddingRight : "14.35%",
  },
  button_area : {
    flex : 6,
    paddingLeft : "19.35%",
    paddingRight : "19.35%",
  },
  text_title : {
    fontSize : RFPercentage(4.7),
    color : "white",
  },
  help_wrapper : {
    flex : 1,
    /* backgroundColor : "green", */
    flexDirection : "row",
  },
  help_create : {
    flex:1,
    textAlign : "left",
  },
  help_forgot : {
    flex:1,
    alignItems : "flex-end"
  },
  text_help : {
    fontSize : RFPercentage(1.5),
    color : "white",
  },
  input_wrapper : {
    flex : 3,
    justifyContent : "flex-end",
  },  
  input_container : {
    width : "100%",
  },
  input : {
    color : "white",
    paddingLeft : "10%",
  },
  button : {
    backgroundColor : "yellow",
    borderRadius : 8,
    height : 55,
  },
  logo_img : {
    zIndex : -999,
    opacity : 0.5,
    position : "absolute",
    resizeMode : 'contain',
    width : '55%',
    height : '60%',
    marginLeft : '37%',
    top : -10
  }
});
