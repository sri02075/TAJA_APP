import React,{Component} from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { Input , Button } from 'react-native-elements'
//import Toast from 'react-native-simple-toast'
import axios from 'axios'

export default class SIgnupScreen extends Component {
    constructor(props){
        super(props)
            this.state = {
                formData: {
                    email: '',
                    nickname: '',
                    password: '',
                    password_confirm : '',
                }
        }
    }
    componentDidMount(){
        this.props.navigation.setOptions(header)
        console.log(this.props.navigation)
    }

    async handleSignIn(){
        const {email,nickname,password,password_confirm} = this.state.formData
        console.log(this.state.formData)
        console.log(`${email} / ${nickname} / ${password}`)
        if(!email || !nickname || !password || !password_confirm){
            alert('정보를 입력해주세요')
            return
        }
        if(password !== password_confirm){
          alert('비밀번호가 일치하지 않습니다.')
          return
        }
        const response = await axios.post(
            'https://api.taja.awmaker.com/user',
            this.state.formData
        )
        if(!response.data.success){
          alert(response.data.errorString)
          return
        }
        this.props.navigation.pop()
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
            onChangeText={value => this.setState(state=>{
                state.formData.email = value
                return state
            })}
          />
          <Input
            containerStyle={styles.input_container}
            inputStyle = {styles.input}
            placeholder='nickname'
            placeholderTextColor="#fff"
            errorStyle={{ color: 'red' }}
            leftIcon={{ type: 'font-awesome',
                        name: 'user-o',
                        color : 'white',
                        size : 15 }}
            errorMessage=''
            onChangeText={value => this.setState(state=>{
                state.formData.nickname = value
                return state
            })}
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
            secureTextEntry={true}
            onChangeText={value => this.setState(state=>{
                state.formData.password = value
                return state
            })}
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
            secureTextEntry={true}
            onChangeText={value => this.setState(state=>{
                state.formData.password_confirm = value
                return state
            })}
          />
        </View>
        <View style={styles.button_area}>
          <Button
            buttonStyle={styles.button}
            title="SIGN UP"
            titleStyle={{color:'black',fontWeight : 'bold'}}
            onPress ={()=>this.handleSignIn()}
          />
        </View>
        <View style={styles.signIn_area}>
          <Text style={styles.text_signIn}>이미 계정이 있으신가요? </Text>
          <TouchableOpacity>
            <Text
              style={{color:'yellow'}}
              onPress={() => this.props.navigation.pop()}
            >
              SIGN_IN.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
    marginLeft : 10,
  },
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1f37',
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
    flex: 7,
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
    flex: 2,
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
})
