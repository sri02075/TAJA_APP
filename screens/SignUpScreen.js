import * as WebBrowser from 'expo-web-browser';
import React,{Component} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Input , Button } from 'react-native-elements';

export default class SIgnupScreen extends Component {
  
  componentDidMount(){
    this.props.navigation.setOptions(header)
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.logo_area}>
          <Image
            source={require('../assets/images/taja_logo.png')}
            style={styles.logo_img}
          />
        </View>
        <View style={styles.title_area}>
          <Text style={styles.text_signUp}>SIGN UP</Text>
        </View>
        <View style={styles.input_area}>
          <Input
            containerStyle={styles.input_container}
            inputStyle = {styles.input}
            placeholder='Email Address'
            placeholderTextColor="#fff"
            errorStyle={{ color: 'red' }}
            leftIcon={{ type: 'font-awesome',
                        name: 'envelope', 
                        color : 'white',
                        size : 15 }}
            errorMessage=''
          />
          <Input
            containerStyle={styles.input_container}
            inputStyle = {styles.input}
            placeholder='Password'
            placeholderTextColor="#fff"
            errorStyle={{ color: 'red' }}
            leftIcon={{ type: 'font-awesome',
                        name: 'lock', 
                        color : 'white',
                        size : 19 }}
            errorMessage=''
          />
          <Input
            containerStyle={styles.input_container}
            inputStyle = {styles.input}
            placeholder='Confirm Password'
            placeholderTextColor="#fff"
            errorStyle={{ color: 'red' }}
            leftIcon={{ type: 'font-awesome',
                        name: 'lock', 
                        color : 'white',
                        size : 19 }}
            errorMessage=''
          />
        </View>
        <View style={styles.button_area}>
          <Button
            buttonStyle={styles.button}
            title="SIGN UP"
            titleStyle={{color:'black',fontWeight : 'bold'}}
          />
        </View>
        <View style={styles.signIn_area}>
          <Text style={styles.text_signIn}>이미 계정이 있으신가요?  </Text> 
           <Text style={{color:'yellow'}}>SIGN_IN.</Text>
        </View>
      </View>
    );
  }
}

const header = {
  title: '',
  headerStyle: {
    backgroundColor: '#000',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
    marginLeft : 10,
  },
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logo_area : {
    flex: 2,
    /* backgroundColor : "blue", */
    justifyContent : "flex-start",
    alignItems : 'center',
  },
  title_area : {
    flex: 3,
    /* backgroundColor : "blue", */
    justifyContent : "flex-start",
    alignItems : "center",
  },
  input_area : {
    flex: 5,
    /* backgroundColor : "green", */
    alignItems : "center",
    paddingLeft : "14.35%",
    paddingRight : "14.35%",
  },
  button_area : {
    flex: 2,
    /* backgroundColor : "white", */
    paddingLeft : "16.35%",
    paddingRight : "16.35%",
  },
  signIn_area : {
    flex: 4,
    /* backgroundColor : "purple", */
    justifyContent : "center",
    flexDirection : "row",
  },
  text_signIn : {
    color : "white",
    fontSize : RFPercentage(1.4),
  },
  text_signUp : {
    fontSize : RFPercentage(5),
    fontWeight : '600',
    color : 'yellow',
    letterSpacing : 2,
    paddingTop : "11%",
  },
  input_container : {
    width : "100%",
  },
  input : {
    color : "white",
    paddingLeft : "10%",
  },
  button : {
    height : 55,
    borderRadius : 8,
    backgroundColor : "yellow"
  },
  logo_img : {
    width : '80%',
    height : '80%',
    resizeMode : 'contain',
    marginTop : "6%"
  },
});
