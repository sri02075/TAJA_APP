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
            chatHistory : [{name: 'sri', contents: 'sad'},{name: 'sri2', contents: 'sadddd'}],
            inputChat : ''
        }

        const channelHandler = new this.sb.ChannelHandler()
        channelHandler.onMessageReceived = function(channel, message) {
            This.chatRefresh()
        }
        this.sb.addChannelHandler("UNIQUE_KEY", channelHandler)
    }
    
    componentDidMount() {
        // this.chatRefresh()
    }

    //11
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
                if(message[0].messageType=="user"){
                    This.state.chatHistory.push({
                        name: message[0]._sender.userId,
                        contents: message[0].message
                    })
                } else {
                    This.state.chatHistory.push({
                        name: message[0].messageType,
                        contents: message[0].message
                    })
                }
                This.setState({
                    chatHistory: This.state.chatHistory
                })
            })
        })
    }

    enterChat(value) {
        const This = this
        const params = new this.sb.UserMessageParams()
        params.message = value.nativeEvent.text
        value =''

        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return;
            }
            openChannel.sendUserMessage(params, function(message, error) {
                if (error) {
                    return;
                }
                This.state.chatHistory.push({
                    name: message._sender.userId,
                    contents: message.message
                })
                This.setState({
                    chatHistory: This.state.chatHistory
                })
            })
        })
    }

    renderChat() {
        return this.state.chatHistory.map((chat,idx) => <ChatContent key={idx} name={chat.name} contents={chat.contents} />)
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
                        onChangeText={value => this.setState({ inputChat : value })}
                        onSubmitEditing={this.enterChat.bind(this)}
                    />
                </View>
            </View>
        )
    }
}

class ChatContent extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View style={styles.chatContent_area}>
                <View style={styles.icon_wrapper}></View>
                <View style={styles.contents_wrapper}>
                    <View style={styles.nickname_wrapper}>
                        <Text style={styles.text_nickname}>{this.props.name}</Text>
                    </View>
                    <View style={styles.chat_wrapper}>
                            <Text style={styles.text_chat}>{this.props.contents}</Text>
                    </View>
                </View>
                <View style={styles.time_wrapper}></View>
            </View>
        )
    }
}

ChatScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1f37',
    },
    chatContent_area: {
        overflow : "visible",
        backgroundColor: 'red',
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderWidth: 1,
        alignItems: 'stretch'
    },
    icon_wrapper: {
        flex: 2,
        backgroundColor: "blue",
    },
    contents_wrapper: {
        flex: 6,
        backgroundColor: "green",
        alignItems: 'stretch',
    },
    time_wrapper: {
        flex: 2,
        backgroundColor: "yellow",
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
        backgroundColor: 'red',
    },
    text_nickname: {
        fontSize: RFValue(16),
        color: 'white',
    }
//     bottom_area: {
//         height: 48,
//         width: "100%",
//         backgroundColor:'red',
//         bottom: 0,
//         flexDirection : 'row'
//     },
//     modal_title_area: {
//         flex:4,
//         backgroundColor:"green",
//     },
//     modal_location_area: {
//         flex:5,
//         backgroundColor:"yellow",
//     },
//     modal_time_area: {
//         flex:9,
//         backgroundColor:"blue",
//     },
//     modal_button_area: {
//         flex:3,
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//         justifyContent: 'flex-end',
//     },
//     row: {
//         height : 100,
//         /* backgroundColor: 'red', */
//         borderBottomWidth: 1,
//         borderBottomColor: '#dcdcdc',
//     },
//     row_wrapper: {
//         flex: 1,
//         flexDirection: 'row',
//     },
//     icon_area: {
//         flex: 2,
//         /* backgroundColor: 'blue', */
//     },
//     description_area: {
//         flex: 5,
//         /* backgroundColor: 'yellow', */
//     },
//     time_area: {
//         flex: 2,
//         /* backgroundColor: 'pink', */
//     },
//     time_wrapper: {
//         flex: 1,
//         /* backgroundColor: 'pink', */
//         alignItems: 'flex-end',
//         paddingRight: 15,
//         paddingTop: 25
//     },
//     description: {
//         flex : 2,
//         flexDirection: 'row',
//     },
//     text_description_title: {
//         fontSize:  RFValue(11),
//         fontWeight: '600',
//         letterSpacing : -1,
//     },
//     text_description: {
//         fontSize:  RFValue(11),
//         color : "gray",
//         letterSpacing : -1,
//     },
//     button : {
//         backgroundColor : "#ffb000",
//         borderRadius : 8,
//     },
//     button_container: {
//         height: 55,
//         width: 50,
//         zIndex : 999,
//         position : "absolute",
//         right: 0,
//         bottom: 100,
//     },
//     logo_wrapper: {
//         flex:1,
//         backgroundColor: 'green',
//     },
//     create_chat_wrapper: {
//         flex:1,
//         backgroundColor: 'blue',
//     },
//     profile_wrapper: {
//         flex:1,
//         backgroundColor: 'yellow',
//     },
//     modal_wrapper: {
//         flex:1,
//         paddingTop: 100,
//         paddingLeft : "10.18%",
//         paddingRight : "10.18%",
//         borderRadius : 100,
//     }
});
