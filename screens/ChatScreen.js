import * as React from 'react';
import { Image, Platform, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {RFValue } from "react-native-responsive-fontsize"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import Modal, { ReactNativeModal } from 'react-native-modal';
import Select from 'react-native-picker-select';
import { Input, Button } from 'react-native-elements'
import SendBird from 'sendbird'

export default class ChatScreen extends React.Component {
    constructor(props){
        super(props)
        const self = this
        this.channelData = this.props.route.params
        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.channelHandler = new this.sb.ChannelHandler()

        this.sb.connect(this.channelData.userName, (user, error) => {})
        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return;
            }

            openChannel.enter(function(response, error) {
                if (error) {
                    return;
                }
                // self.sendCustomMessage(`${self.channelData.userName}님이 입장하셨습니다!!`)
            })
        })

        this.state = {
            chatHistory : [],
            participants : [],
            inputChat : '',
            defaultIcon : '../assets/images/taja_logo.png',
            isPlus: false,
            isFrozen: false,
            isModalVisible: false,
            selectedModal: 0,
        }

        this.channelHandler.onMessageReceived = function(channel, message) {
            self.chatRefresh()
        }
        this.channelHandler.onUserEntered = function(channel, message) {
            // self.chatRefresh()
        }
        this.sb.addChannelHandler("UNIQUE_KEY", this.channelHandler)
        BackHandler.addEventListener('hardwareBackPress', () => {
            if(self.state.isPlus){
                self.setState({ isPlus: false })
            } else {
                self.toggleModal(0)
            }
            return true
        })
    }

    getParticipants() {
        this.sb.OpenChannel.getChannel(this.channelData.url, (openChannel, error) => {
            openChannel.getMetaData("participantsList", (response, error) => {
                sd
            })
        })
    }

    sendCustomMessage(str) {
        const self = this
        const params = new this.sb.UserMessageParams()
        params.message = str

        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return
            }
            openChannel.sendUserMessage(params, function(message, error) {
                if (error) {
                    return
                }
                self.state.chatHistory.push({
                    profileLogo: '',
                    name: self.channelData.userName,
                    contents: message.message,
                    timeStamp: message.createdAt
                })
                self.setState({
                    chatHistory: self.state.chatHistory,
                    inputChat: ''
                })
            })
        })
    }

    componentDidMount() {
        const self = this
        this.props.navigation.setOptions(header)
        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return;
            }
        
            const lastMessage = openChannel.createPreviousMessageListQuery()
            lastMessage.limit = 100

            lastMessage.load(function(message, error) {
                if (error) {
                    return
                }
                message.forEach((msg) => {
                    let nameInfo
                    if(msg.messageType=="user"){
                        nameInfo = msg._sender.userId
                    } else {
                        nameInfo = 'ADMIN'
                    }
                    self.state.chatHistory.push({
                        profileLogo: '',
                        name: nameInfo,
                        contents: msg.message,
                        timeStamp: msg.createdAt
                    })
                })
                
                self.setState({
                    chatHistory: self.state.chatHistory
                })
            })  
        })
        
    }

    convertTimeStamp(timeStamp) {
        const time = new Date(timeStamp)
        let hour = time.getHours()
        let minute = time.getMinutes()
        let part = "오전"
        if(hour>12){
            part = "오후"
            hour -= 12
        }
        if(hour<10){
            hour = `0${hour}`
        }
        if(minute<10){
            minute = `0${minute}`
        }
        
        return `${part} ${hour}:${minute}`
    }

    
    chatRefresh(){
        const self = this
        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return;
            }
        
            const lastMessage = openChannel.createPreviousMessageListQuery()
            lastMessage.limit = 1

            lastMessage.load(function(message, error) {
                if (error) {
                    return
                }
                let nameInfo
                if(message[0].messageType=="user"){
                    nameInfo = message[0]._sender.userId
                } else {
                    nameInfo = 'ADMIN'
                }

                self.state.chatHistory.push({
                    profileLogo: '',
                    name: nameInfo,
                    contents: message[0].message,
                    timeStamp: Date.now()
                })

                self.setState({
                    chatHistory: self.state.chatHistory
                })
            })
        })
    }

    onContentSizeChangeHandler() {
        if(this.state.chatHistory.length>0){
            if(this.state.chatHistory[this.state.chatHistory.length-1].name===this.channelData.userName){
                this.scrollview.scrollToEnd({animated: true})
            }
        }
        
    }

    renderChat() {
        return this.state.chatHistory.map((chat,idx) =>{
            return (this.channelData.userName===chat.name) ?
            <ChatContentByMe key={idx} contents={chat.contents} time={this.convertTimeStamp(chat.timeStamp)} /> :
            <ChatContentByOther key={idx} name={chat.name} contents={chat.contents} icon={this.state.defaultIcon} time={this.convertTimeStamp(chat.timeStamp)} />
        })
    }

    renderPlus() {
        const self = this
        const funcArr = [
            () => { self.toggleModal(3) },
            () => { self.toggleModal(2) },
            () => { self.toggleModal(1) },
        ]
        return (this.state.isPlus) ? <PlusCollection funcArr={funcArr} /> : <View/>
    }
    toggleModal(i) {
        this.setState({
            isModalVisible: true,
            selectedModal: i
        })
    }
    renderModal() {
        const self = this
        const cancle = ()=>{self.setState({isModalVisible: false})}
        return [
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==0)}
                isType={1}
                cancle={() => {cancle()}}
                ok={() => {self.props.navigation.goBack()}}
                text={"채팅을 끝내시겠습니까?"} />,
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==1)}
                isType={1}
                cancle={() => {cancle()}}
                ok={() => {
                    self.sb.OpenChannel.getChannel(this.channelData.url, (openChannel, error) => {
                        openChannel.updateMetaData({isFrozen: 'true'})
                    })
                }}
                text={"모집을 완료하시겠습니까?"} />,
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==2)}
                isType={2}
                cancle={() => {cancle()}}
                ok={() => {}}
                text={"더치페이 금액을 입력해주세요."} />,
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==3)}
                isType={1}
                cancle={() => {cancle()}}
                ok={() => {cancle()}}
                text={"미구현 기능입니다."} />
        ]
    }
    render(){
        return (
            <View style={styles.container}>
                <ScrollView
                    syle={{transform: [{ scaleY: -1 }]}}
                    ref={ref => this.scrollview = ref}
                    onContentSizeChange={this.onContentSizeChangeHandler.bind(this)} 
                >
                    <View>{this.renderChat()}</View>
                </ScrollView>
                {this.renderPlus()}
                <View style={styles.input_wrapper}>
                    <TouchableOpacity style={styles.input_plus_wrapper} onPress={()=>{this.setState({isPlus: !this.state.isPlus})}} >
                        <Image style={styles.input_plus} source={require('../assets/images/plus.png')} />
                    </TouchableOpacity>
                    <View style={styles.input_chat_wrapper}>
                        <Input
                            inputContainerStyle={styles.inputContainer_input_chat}
                            inputStyle={styles.inputStyle_input_chat}
                            style={styles.input_chat}
                            value={this.state.inputChat}
                            onChangeText={value => this.setState({ inputChat : value })}
                        />
                    </View>
                    <TouchableOpacity style={styles.input_send_wrapper} onPress={()=>{this.sendCustomMessage(this.state.inputChat)}} >
                        <Image style={styles.input_send} source={require('../assets/images/send.png')} />
                    </TouchableOpacity>
                </View>
                {this.renderModal()}
            </View>
        )
    }
}

class ModalConfirm extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Modal isVisible={this.props.isVisible}>
                <View style={styles.modal_enterChat_wrapper}>
                    <View style={{height:230,backgroundColor:'white',padding : 25,borderRadius:10}}>
                        <ModalConTents isType={this.props.isType} text={this.props.text}/>
                        <View style={styles.modal_last_area}>
                            <View style={styles.modal_button_area}>
                                <Button titleStyle={{color:'black'}} type="clear" title="취소" onPress={()=>this.props.cancle()} />
                                <View style={{width:16}}></View>
                                <Button titleStyle={{color:'black'}} type="clear" title="확인" onPress={()=>this.props.ok()} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

class ModalConTents extends React.Component {
    render() {
        if(this.props.isType==1){
            return(
                <View style={styles.modal_content_area}>
                    <Text style={styles.text_modal_content}>{this.props.text}</Text>
                </View>
            )
        } else if(this.props.isType==2){
            return(
                <View style={styles.modal_content_wrapper}>
                    <View style={styles.modal_title_area}>
                        <Text style={styles.text_modal_title}>{this.props.text}</Text>
                    </View>
                    <View style={styles.modal_input_wrapper}>
                        <View style={styles.modal_input_area}>
                            <Input style={styles.input_modal} />
                        </View>
                        <View style={styles.modal_input_info_area}>
                            <Text>3/4</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }
}

class PlusCollection extends React.Component {
    render() {
        return(
            <View style={styles.btn_wrapper}>
                <TouchableOpacity style={styles.btn_gallery_wrapper} onPress={()=>{this.props.funcArr[0]()}} >
                    <View style={styles.btn_gallery_icon_wrapper}>
                        <Image style={styles.btn_gallery} source={require('../assets/images/plus.png')} />
                    </View>
                    <View style={styles.btn_gallery_text_wrapper}>
                        <Text style={styles.btn_gallery_text}>갤러리</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_dutch_wrapper} onPress={()=>{this.props.funcArr[1]()}} >
                    <View style={styles.btn_dutch_icon_wrapper}>
                        <Image style={styles.btn_dutch} source={require('../assets/images/plus.png')} />
                    </View>
                    <View style={styles.btn_dutch_text_wrapper}>
                        <Text style={styles.btn_dutch_text}>더치페이</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_endInvite_wrapper} onPress={()=>{this.props.funcArr[2]()}} >
                    <View style={styles.btn_endInvite_icon_wrapper}>
                        <Image styl4444444e={styles.btn_endInvite} source={require('../assets/images/plus.png')} />
                    </View>
                    <View style={styles.btn_endInvite_text_wrapper}>
                        <Text style={styles.btn_endInvite_text}>모집종료</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

class ChatContentByOther extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View style={styles.chatContent_area}>
                <View style={styles.icon_wrapper}>
                    <Image style={styles.image_icon} source={require('../assets/images/taja_logo.png')} />
                </View>
                <View style={styles.contents_wrapper}>
                    <View style={styles.nickname_wrapper}>
                        <Text style={styles.text_nickname}>{this.props.name}</Text>
                    </View>
                    <View style={styles.chat_wrapper}>
                        <Text style={styles.text_chat}>{this.props.contents}</Text>
                    </View>
                </View>
                <View style={styles.time_wrapper}>
                    <Text style={styles.text_time}>  {this.props.time}</Text>
                </View>
            </View>
        )
    }
}


class ChatContentByMe extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View style={styles.chatContent_area_me}>
                <View style={styles.time_wrapper_me}>
                    <Text style={styles.text_time}>{this.props.time}  </Text>
                </View>
                <View style={styles.contents_wrapper}>
                    <View style={styles.chat_wrapper_me}>
                        <Text style={styles.text_chat}>{this.props.contents}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const header = {
    title: '채팅방',
    headerStyle: {
        backgroundColor: '#0d1f37',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
}

const styles = StyleSheet.create({
    input_wrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    input_plus_wrapper: {
        flex: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    input_plus: {
        width: '57.5%',
        height: '57.5%', //57.5%
        // borderColor: 'black',
        // borderWidth: 1,
        resizeMode: 'center'
    },
    input_chat_wrapper: {
        flex: 80,
        borderWidth: 1,
        borderColor: 'black',
    },
    inputContainer_input_chat: {
        width: '100%',
        borderColor: 'white',
    },
    inputStyle_input_chat: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        color: 'yellow'
    },
    input_chat: {
        width: '100%',
        color: 'yellow',
    },
    input_send_wrapper: {
        flex: 17,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    input_send: {
        width: '57.5%',
        height: '57.5%', //57.5%
        // borderColor: 'black',
        // borderWidth: 1,
        resizeMode: 'center'
    },
    container: { 
        flex: 1,
        backgroundColor: '#0d1f37',
    },
    chatContent_area: {
        overflow : "visible",
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingBottom: 10,
        marginHorizontal: '2%'
    },
    icon_wrapper: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image_icon: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 1000,
    },
    contents_wrapper: {
        alignItems: 'stretch',
        maxWidth: '60%',
    },
    time_wrapper: {
        width: '20%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    nickname_wrapper: {
        flex: 2,
    },
    chat_wrapper: {
        flex: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    text_chat: {
        fontSize: RFValue(16),
    },
    text_nickname: {
        fontSize: RFValue(16),
        color: '#A8AEB7',
    },
    text_time: {
        color: '#6E7887'
    },

    chatContent_area_me: {
        overflow : "visible",
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        paddingBottom: 10,
        marginHorizontal: '2%'
    },
    time_wrapper_me: {
        width: '20%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    chat_wrapper_me: {
        flex: 2,
        backgroundColor: '#F5CB4D',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'stretch',
    },

    modal_title_area: {
        flex:4,
        /* backgroundColor:"green", */
        justifyContent: 'center',
    },
    modal_location_area: {
        flex:5,
        /* backgroundColor:"yellow", */
    },
    modal_time_area: {
        flex:9,
        /* backgroundColor:"blue", */
    },
    modal_description_area: {
        flex:10,
        /* backgroundColor:"yellow", */
    },
    modal_last_area: {
        flex:4,
        /* backgroundColor:"blue", */
    },
    modal_button_area: {
        flex:3,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    modal_timePicker_wrapper: {
        flex:6,
    },

    btn_wrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
    }
});
