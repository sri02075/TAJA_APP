import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {RFValue } from "react-native-responsive-fontsize"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Select from 'react-native-picker-select';
import { Input, Button } from 'react-native-elements'
import SendBird from 'sendbird'

export default class ChatScreen extends React.Component {
    constructor(props){
        super(props)
        const This = this

        this.channelData = this.props.route.params

        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.sb.connect(this.channelData.userName, (user, error) => {})
        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return;
            }

            openChannel.enter(function(response, error) {
                if (error) {
                    return;
                }
            })
        })

        this.state = {
            chatHistory : [],
            participants : [],
            inputChat : '',
            defaultIcon : '../assets/images/taja_logo.png',
        }

        const channelHandler = new this.sb.ChannelHandler()
        channelHandler.onMessageReceived = function(channel, message) {
            This.chatRefresh()
        }
        this.sb.addChannelHandler("UNIQUE_KEY", channelHandler)
    }
    
    sendCustomMessage(str) {
        const This = this
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
                This.state.chatHistory.push({
                    name: message._sender.userId,
                    contents: message.message
                })
                This.setState({
                    chatHistory: This.state.chatHistory,
                    inputChat: ''
                })
            })
        })
    }

    componentDidMount() {
        const This = this
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
                message.map((msg) => {
                    let nameInfo
                    if(msg.messageType=="user"){
                        nameInfo = msg._sender.userId
                    } else {
                        nameInfo = 'ADMIN'
                    }
                    This.state.chatHistory.push({
                        profileLogo: '',
                        name: nameInfo,
                        contents: msg.message,
                        timeStamp: msg.createdAt
                    })
                })
                This.setState({
                    chatHistory: This.state.chatHistory
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
        const This = this
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

                This.state.chatHistory.push({
                    profileLogo: '',
                    name: nameInfo,
                    contents: message[0].message,
                    timeStamp: Date.now()
                })

                This.setState({
                    chatHistory: This.state.chatHistory
                })
            })
        })
    }

    enterChat(value) {
        this.sendCustomMessage(value.nativeEvent.text)
    }

    //11
    // nBBang(money) {
    //     this.sendCustomMessage(
    //         `더치페이 금액은 ${money/(this.state.participants.length)}입니다!
    //         `)
    // }

    renderChat() {
        return this.state.chatHistory.map((chat,idx) =>{
            return (this.channelData.userName===chat.name) ?
            <ChatContentByMe key={idx} contents={chat.contents} time={this.convertTimeStamp(chat.timeStamp)} /> :
            <ChatContentByOther key={idx} name={chat.name} contents={chat.contents} icon={this.state.defaultIcon} time={this.convertTimeStamp(chat.timeStamp)} />
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <ScrollView syle={{transform: [{ scaleY: -1 }]}}>
                    <View>{this.renderChat()}</View>
                </ScrollView>
                <View>
                    {/* <Button value="나가기" onClick={this.exit} /> */}
                    <Input
                        value={this.state.inputChat}
                        onChangeText={value => this.setState({ inputChat : value })}
                        onSubmitEditing={this.enterChat.bind(this)}
                    />
                </View>
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

ChatScreen.navigationOptions = {
    header: null,
}


const styles = StyleSheet.create({
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
});
