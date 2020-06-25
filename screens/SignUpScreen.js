import React,{Component} from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View , Keyboard} from 'react-native'
import { RFPercentage } from "react-native-responsive-fontsize"
import { Input , Button, CheckBox } from 'react-native-elements'
//import Toast from 'react-native-simple-toast'
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay';

export default class SignupScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            formData: {
                email: '',
                //verification_code: '',
                nickname: '',
                password: '',
                password_confirm : '',
            },
            checked: false,
            spinner: false,
            appearKeyboard  : false,
        }
    }
    componentDidMount(){
        console.log(this.props.route,this.props.navigation)
        this.props.navigation.setOptions(header)
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>this.setState({appearKeyboard : true}))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>this.setState({appearKeyboard : false}))
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    async handleSignIn(){
        const {email,nickname,password,password_confirm} = this.state.formData
        const {checked} = this.state
        if(!email || !nickname || !password || !password_confirm){
            alert('정보를 입력해주세요')
            return
        }
        console.log(checked)
        if(!checked){
            alert('개인정보 이용동의를 체크해주세요')
            return
        }
        if(password !== password_confirm){
            alert('비밀번호가 일치하지 않습니다.')
            this.setState({password_confirm:''})
            return
        }
        this.setState({spinner:!this.state.spinner})
        const response = await axios.post(
            'https://api.taja.awmaker.com/user',
            this.state.formData
        )
        if(!response.data.success){
            alert(response.data.errorString)
            this.setState({spinner:!this.state.spinner})
            return
        }
        this.setState({spinner:!this.state.spinner})
        this.props.navigation.pop()
    }
    render(){
        return (
        <View style={styles.container}>
            <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={{color: '#FFF'}}
            />
            <View style={this.state.appearKeyboard ? {display: 'none'} : styles.logo_area}>
            <Image
                source={require('../assets/images/taja_logo.png')}
                style={styles.logo_img}
            />
            </View>
            <View style={this.state.appearKeyboard ? {display: 'none'} : styles.title_area}>
                <Text style={this.state.appearKeyboard ? {fontSize : 0} : styles.text_signUp}>SIGN UP</Text>
            </View>
            <View style={this.state.appearKeyboard ? focusInputAreaStyle : styles.input_area}>
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
                {/* <Input
                    containerStyle={styles.input_container}
                    inputStyle = {styles.input}
                    placeholder='Verification Code'
                    placeholderTextColor="#fff"
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome',
                                name: 'envelope',
                                color : 'white',
                                size : 15 }}
                    errorMessage=''
                    onChangeText={value => this.setState(state=>{
                        state.formData.verification_code = value
                        return state
                    })}
                /> */}
                <Input
                    containerStyle={styles.input_container}
                    inputStyle = {styles.input}
                    placeholder='Nickname'
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
                <View style={this.state.appearKeyboard ? {display: 'none'} : styles.checkbox_wrapper}>
                    <CheckBox
                        containerStyle={{flex:1}}
                        title=''
                        size={20}
                        checkedColor='#ffb000'
                        checked={this.state.checked}
                        onPress={() => this.setState({checked: !this.state.checked})}
                    />
                    <TouchableOpacity
                        style={{flex:50}}
                        onPress={() => WebBrowser.openBrowserAsync('http://policy.taja.awmaker.com/')}>
                        <Text style={{color : "white", fontSize : RFPercentage(1.4)}}>개인정보 수집 및 이용에 대한 동의 (필수)</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={this.state.appearKeyboard ? {display: 'none'} : styles.button_area}>
                <Button
                    buttonStyle={styles.button}
                    title="SIGN UP"
                    titleStyle={{color:'black',fontWeight : 'bold'}}
                    onPress ={()=>this.handleSignIn()}
                />
            </View>
            <View style={this.state.appearKeyboard ? {display: 'none'} : styles.signIn_area}>
                <Text style={styles.text_signIn}>이미 계정이 있으신가요? </Text>
                <TouchableOpacity>
                    <Text
                    style={{color:'#ffb000',fontSize : RFPercentage(1.4)}}
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

const focusInputAreaStyle = {
    height : '60%',
    alignItems : "center",
    paddingLeft : "14.35%",
    paddingRight : "14.35%",
    paddingTop : "15%",
    //height:
}

const focusInputStyle ={

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
        flex: 8,
        /* backgroundColor : "green", */
        alignItems : "center",
        paddingLeft : "14.35%",
        paddingRight : "14.35%",
    },
    button_area : {
        flex: 2,
        /* backgroundColor : "white", */
        marginTop: 30,
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
        color : '#ffb000',
        letterSpacing : 2,
        paddingTop : "11%",
    },
    input_container : {
        flex: 1,
        width : "100%",
    },
    checkbox_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: -10,
    },
    input : {
        color : "white",
        paddingLeft : "10%",
        fontSize : RFPercentage(1.7),
    },
    button : {
        height : 55,
        borderRadius : 8,
        backgroundColor : "#ffb000"
    },
    logo_img : {
        width : '80%',
        height : '80%',
        resizeMode : 'contain',
        marginTop : "6%"
    },
})
