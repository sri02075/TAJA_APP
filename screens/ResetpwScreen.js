import React,{Component} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Input , Button, withTheme } from 'react-native-elements';

export default class ResetpwScreen extends Component {
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
          <Text style={styles.text_title}>PASSWORD RESET</Text>
        </View>
        <View style={styles.input_area}>
          <Input
            containerStyle={styles.input_container}
            inputStyle = {styles.input}
            placeholder='Email Address'
            placeholderTextColor="#fff"
            errorStyle={{ color: 'red' }}
            leftIcon={{ type: 'font-awesome', name: 'envelope', color : 'white' }}
            errorMessage=''
          />
        </View>
        <View style={styles.button_area}>
          <Button
            containerStyle={{marginTop : '15%'}}
            buttonStyle={styles.button}
            title="SEND"
            titleStyle = {{color : 'black',fontWeight : 'bold'}}
            onPress={()=>alert('미구현 기능입니다\n관리자에게 문의하세요')}
          />
        </View>
      </View>
    );
  }
}

const header = {
  title: '',
  headerStyle: {
    backgroundColor: '#0d1f37',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1f37',
  },
  logo_area : {
    flex : 3,
    justifyContent : 'center',
    alignItems : 'center',
    /* backgroundColor : '#fff', */
  },
  title_area : {
    flex : 3,
    justifyContent : 'center',
    alignItems : 'center',
    /* backgroundColor : 'gray', */
  },
  input_area : {
    flex : 3,
    /* backgroundColor : 'blue', */
    justifyContent : 'center',
    alignItems : 'center',
    paddingLeft : "14.35%",
    paddingRight : "14.35%",
  },
  button_area : {
    flex : 8,
    /* backgroundColor : 'green', */
    paddingLeft : "19.35%",
    paddingRight : "19.35%",
  },
  logo_img : {
    width : '55%',
    height : '55%',
    resizeMode : 'contain',
    marginTop : '5%'
  },
  text_title : {
    fontSize : RFPercentage(4),
    color : "yellow",
    fontWeight : '600',
    letterSpacing : 4
  },
  input : {
    color : "white",
    paddingLeft : "10%",
  },
  button : {
    backgroundColor : "yellow",
    borderRadius : 8,
    height : 55,
  }
});
