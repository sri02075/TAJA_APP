import React,{Component} from 'react'
import { Image, Platform, StyleSheet,PixelRatio, Text, TouchableOpacity, View ,ScrollView ,Keyboard} from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { Input , Button, withTheme } from 'react-native-elements'
import axios from 'axios'
import deviceStorage from '../deviceStorage.js';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email : '',
            password : '',
        }
        /*jwt check function*/
        const checkJWT = async () => {
            try {
                /*토큰 가져온후 토큰 유효성검사 user*/
                const token = await deviceStorage.getItem('JWT')
                const response = await axios.get(
                    'https://api.taja.awmaker.com/user',
                    { headers: {"Authorization" : token}}
                )
                const {result, success} = response.data
                if(success){
                    this.props.navigation.navigate('Home',{
                        token: token,
                        nickname: result
                    })
                }
            }catch(err){
                console.log(err)
            }
        }
        checkJWT()
    }
    componentDidMount() {
        console.log(this.props.navigation,this.props.route)
        /* const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
        })
        this.props.navigation.dispatch(resetAction) */
        this.props.navigation.setOptions(header)
    }
    async loginUser() {
        const inputData = this.state
        if(inputData.email !== '' && inputData.password !== ''){
            const response = await this.loginCheck()
            const {result,success} = response.data
            if(success){
                //alert(result.token)
                await deviceStorage.saveItem('JWT', result.token)
                const token = await deviceStorage.getItem('JWT')
                this.props.navigation.navigate('Home',token)
            }else{
                alert('아이디와 비밀번호를 확인해주세요')
            }
        }else{
            this.props.navigation.navigate('Home')
            //alert('이메일과 패스워드를 입력해주세요')
        }
    }
    async loginCheck() {
        const {email,password} = this.state
        const response = await axios.post(
            'https://api.taja.awmaker.com/auth',
            {
                email: email,
                password: password
            }
        )
        return response
    }
    render() {
        return (
            <View style={styles.container}>
                {/* <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="always"> */}
                <Image
                    source={require('../assets/images/taja_logo.png')}
                    style={styles.logo_img}
                />
                <View style={styles.title_area }>
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
                        leftIcon={{ type: 'font-awesome', name: 'envelope', color : 'white',size : 15 }}
                        errorMessage=''
                        onChangeText={value => this.setState({ email : value })}
                    />
                    <Input
                        containerStyle={styles.input_container}
                        inputStyle = {styles.input}
                        placeholder='Password'
                        placeholderTextColor="#fff"
                        errorStyle={{ color: 'red' }}
                        leftIcon={{ type: 'font-awesome', name: 'lock',color : 'white' ,size : 19 }}
                        errorMessage=''
                        secureTextEntry={true}
                        onChangeText={value => this.setState({ password : value })}
                    />
                    </View>
                    <View style={styles.help_wrapper}>
                    <View style={styles.help_create}>
                    <TouchableOpacity>
                        <Text style={styles.text_help}
                        onPress={() => this.props.navigation.navigate('SignUp')}
                        >
                        계정을 생성하시겠어요?
                        </Text>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.help_forgot}>
                    <TouchableOpacity>
                        <Text style={styles.text_help}
                        onPress={() => this.props.navigation.navigate('ResetPw')}
                        >
                        비밀번호를 잊으셨나요?
                        </Text>
                    </TouchableOpacity>
                    </View>
                    </View>
                </View>
                <View style={styles.button_area}>
                <Button
                    buttonStyle={styles.button}
                    title="SIGN IN"
                    titleStyle = {{color : 'black',fontWeight : 'bold'}}
                    onPress={() => this.loginUser()}
                />
                </View>
                {/* </ScrollView> */}
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
    },
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1f37',
    },
    title_area : {
        flex : 6,
        /* backgroundColor : "red", */
        justifyContent : "flex-end",
        paddingBottom : "4%",
        alignItems : "flex-start",
        paddingLeft : "14.35%",
        minHeight :250,
    },
    input_area : {
        flex : 5,
        /* backgroundColor : "blue", */
        paddingLeft : "14.35%",
        paddingRight : "14.35%",
        minHeight : 200,
        marginTop : "5%"
    },
    button_area : {
        flex : 6,
        paddingLeft : "19.35%",
        paddingRight : "19.35%",
        minHeight : 250,
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
    },
    help_forgot : {
        flex:1,
        alignItems : "flex-end"
    },
    text_help : {
        fontSize : RFPercentage(1.5),
        color : "white",
        textAlign : "left",
    },
    input_wrapper : {
        flex : 3,
        justifyContent : "flex-end",
    },
    input_container : {
        width : "100%",
    },
    input : {
        flex : 1,
        color : "white",
        paddingLeft : "10%",
        fontSize : RFPercentage(1.7),
    },
    button : {
        backgroundColor : "#ffb000",
        borderRadius : 8,
        height : 55,
    },
    logo_img : {
        zIndex : -999,
        opacity : 0.3,
        position : "absolute",
        resizeMode : 'contain',
        width : 200 ,
        height : 300 ,
        marginLeft : '37%',
        top : -14
    }
})
