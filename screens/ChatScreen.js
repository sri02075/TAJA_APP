import * as React from 'react'
import { Image, TextInput, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {RFValue } from "react-native-responsive-fontsize"
import Icon from 'react-native-vector-icons/FontAwesome'
import { ScrollView } from 'react-native-gesture-handler'
import Modal, { ReactNativeModal } from 'react-native-modal'
import Select from 'react-native-picker-select'
import { Input, Button } from 'react-native-elements'
import SendBird from 'sendbird'

export default class ChatScreen extends React.Component {
    constructor(props){
        super(props)
        const self = this
        this.channelData = this.props.route.params
        console.log('-------------------start--------------------------')
        console.log(this.props.route.params)
        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.channelHandler = new this.sb.ChannelHandler()
        console.log(this.channelData.userName)
        this.sb.connect(this.channelData.userName, (user, error) => {})
        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return
            }
            self.channel = openChannel
            openChannel.enter(function(response, error) {
                if (error) {
                    return
                }
                self.setState({ user_count: self.channel.participantCount })
            })
        })

        this.state = {
            chatHistory : [],
            members : [],
            inputChat : '',
            defaultIcon : '../assets/images/taja_logo.png',
            isPlus: false,
            isFrozen: false,
            isModalVisible: false,
            selectedModal: 0,

            payList : [],
            user_count: 0,
        }
        
        this.channelHandler.onMessageReceived = (channel, message) => {
            self.chatRefresh()
        }
        this.channelHandler.onUserEntered = (channel, message) => {
            self.setState({ memberNum: self.channel.participantCount })
            channel.getMetaData(["userList"],(response, error) => {
                console.log(self.channelData.userName)
                if(response.userList==null){
                    self.channel.createMetaData({userList: JSON.stringify({userList: [self.channelData.userName]})})
                    self.setState({ userList: [self.channelData.userName] })
                } else {
                    const userList = JSON.parse(response.userList).userList
                    if(!userList.includes(self.channelData.userName)){
                        console.log(`${response.userList}_${self.channelData.userName}`)
                        
                        self.channel.updateMetaData({userList: JSON.stringify({userList: [...userList, self.channelData.userName]})})
                    }
                }  
            })
        }
        this.channelHandler.onUserExited = function(channel, message) {
            console.log(message)
            // self.setState({
            //     members: [...self.state.members, ]
            // })
            channel.participantCount
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
        header.headerLeft = ()=>(
            <TouchableOpacity style={{width:25,marginLeft:19}} onPress={()=>self.toggleModal(0)}>
                <Icon
                    name="arrow-left"
                    size={25}
                    color="white"
                />
            </TouchableOpacity>
        )
        this.props.navigation.setOptions(header)
        this.sb.OpenChannel.getChannel(this.channelData.url, function(openChannel, error) {
            if (error) {
                return
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
                return
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


    getDutchPayMessage(){
        const {payList} = this.state
        const result = payList.reduce((acc,cur,idx)=>{
            const str = `${idx+1}번째 멤버 : ${cur}원\n`
            return acc+str
        },'')
        return result
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
                ok={() => {
                    self.channel.exit((response, error)=>{
                        // alert(`${self.channelData.userName}님이 나갔습니다.`) // 나감 알림
                    })
                    self.props.navigation.goBack()
                }}
                text={"채팅을 끝내시겠습니까?"} />,
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==1)}
                isType={1}
                cancle={() => {cancle()}}
                ok={() => {
                    self.sb.OpenChannel.getChannel(this.channelData.url, (openChannel, error) => {
                        openChannel.updateMetaData({isFrozen: 'true'})
                        self.setState({isModalVisible: false})
                        self.sendCustomMessage("합승자 모집이 완료되었습니다.")
                    })
                }}
                text={"모집을 종료하시겠습니까?"} />,
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==2)}
                isType={2}
                cancle={() => {cancle()}}
                user_count={this.state.user_count}
                changePayList = {(payList)=>this.setState({payList:payList},()=>{this.sendCustomMessage(this.getDutchPayMessage());cancle()})}
                ok={() => {cancle()}}
                text={"더치페이"} />,
            <ModalConfirm
                isVisible={(this.state.isModalVisible) && (this.state.selectedModal==3)}
                isType={1}
                cancle={() => {cancle()}}
                ok={() => {cancle()}}
                text={"미구현 기능입니다."} />
        ]
    }

    renderMember(){
        return <View/>
    }
    calculatePay(pay,user_count){
        const result = []
        for(let i=0; i<user_count; i++){
            result.push(Math.floor(pay/user_count))
        }
        const sum = result.reduce((acc,cur)=>acc+cur)
            if(pay !== sum){
            for(let j=0; j<pay-sum; j++){
                result[j] += 1
            }
        }
        return result
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.member_status_wrapper}>
                    <View style={styles.member_icon_wrapper}>
                        <Image style={styles.member_icon} source={require('../assets/images/member.png')}/>
                    </View>
                    <View style={styles.member_wrapper}>
                        <Profile text={"최대8자까지된다"}/>
                        <Profile text={"혼자타고싶어요"}/>
                        <Profile text={"아저씨"}/>
                        <Profile text={"꽃강아지"}/>
                    </View>
                    <View style={styles.spread_icon_wrapper}>
                        <Image style={styles.spread_icon} source={require('../assets/images/spread.png')}/>
                    </View>
                </View>
                <ScrollView
                    stickyHeaderIndices={true}
                    syle={{transform: [{ scaleY: -1 }]}}
                    ref={ref => this.scrollview = ref}
                    style={styles.chat_area}
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
                        <TextInput
                            style={styles.input_chat}
                            value={this.state.inputChat}
                            selectionColor='#FFB000'
                            multiline={true}
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

class Profile extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View style={styles.profile_wrapper}>
                <View style={styles.profile_icon_wrapper}>
                    <Image style={styles.profile_icon} source={require('../assets/images/default_profile.png')}/>
                </View>
                <View style={styles.profile_text_wrapper}>
                    <Text style={styles.profile_text}>{this.props.text}</Text>
                </View>
            </View>
        )
    }
}

class ModalConfirm extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            totalPay : undefined,
        }
        this.input_pay = React.createRef();
    }
    
    handleConfirm(){
        if(this.props.isType == 2 ){
            if(!this.state.totalPay){
                alert('금액을 입력해주세요')
                return
            }
            if(isNaN(this.state.totalPay*1)){
                alert('숫자를 입력해주세요')
                this.input_pay.current.clear()
                return
            }
            const payList =this.calculatePay(this.state.totalPay,this.props.user_count)
            console.log(JSON.stringify(payList))
            this.props.changePayList(payList)
            this.input_pay.current.clear()

            return
        }
        this.props.ok()
    }
    calculatePay(pay,user_count){
        const result = []
        for(let i=0; i<user_count; i++){
            result.push(Math.floor(pay/user_count))
        }
        const sum = result.reduce((acc,cur)=>acc+cur)
            if(pay !== sum){
            for(let j=0; j<pay-sum; j++){
                result[j] += 1
            }
        }
        return result
    }
    render(){
        return(
            <Modal isVisible={this.props.isVisible}>
                <View style={styles.modal_enterChat_wrapper}>
                    <View style={{height: this.props.isType == 1 ? 150 : 230,backgroundColor:'white',padding : 25,borderRadius:10}}>
                        <ModalConTents 
                            isType={this.props.isType}
                            text={this.props.text}
                            input_pay={this.input_pay}
                            user_count={this.props.user_count}
                            onChangeText={(value)=>this.setState({totalPay:value})}/>
                        <View style={styles.modal_last_area}>
                            <View style={styles.modal_button_area}>
                                <Button titleStyle={{color:'black'}} type="clear" title="취소" onPress={()=>this.props.cancle()} />
                                <View style={{width:16}}></View>
                                <Button titleStyle={{color:'black'}} type="clear" title="확인" onPress={()=>this.handleConfirm()} />
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
                        <View style={styles.modal_input_wrapper_wrapper}>
                            <View style={styles.modal_input_area}>
                                <Input
                                    ref={this.props.input_pay}
                                    containerStyle={{flex:1,justifyContent:'center',alignItems:'center'}}
                                    inputContainerStyle={{borderBottomWidth:0,alignItems:'center',justifyContent:'center'}}
                                    inputStyle={{alignItems:'flex-end',justifyContent:'center',fontSize: RFValue(20),color:'gray'}}
                                    onChangeText={(value)=>this.props.onChangeText(value)}/>
                                <Text style={{fontSize:RFValue(20)}}>원</Text>
                            </View>
                            <View style={styles.modal_input_info_area}>
                                <Text style={{fontSize:RFValue(20)}}>{`/ ${this.props.user_count}명`}</Text>
                            </View>
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
                        <Image style={styles.btn_gallery} source={require('../assets/images/gallary.png')} />
                    </View>
                    <View style={styles.btn_gallery_text_wrapper}>
                        <Text style={styles.btn_gallery_text}>갤러리</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.bar} />
                <TouchableOpacity style={styles.btn_dutch_wrapper} onPress={()=>{this.props.funcArr[1]()}} >
                    <View style={styles.btn_dutch_icon_wrapper}>
                        <Image style={styles.btn_dutch} source={require('../assets/images/coin.png')} />
                    </View>
                    <View style={styles.btn_dutch_text_wrapper}>
                        <Text style={styles.btn_dutch_text}>더치페이</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.bar} />
                <TouchableOpacity style={styles.btn_endInvite_wrapper} onPress={()=>{this.props.funcArr[2]()}} >
                    <View style={styles.btn_endInvite_icon_wrapper}>
                        <Image style={styles.btn_endInvite} source={require('../assets/images/stop.png')} />
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
                    <Image style={styles.image_icon} source={require('../assets/images/default_profile.png')} />
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
        borderBottomWidth: 0,
        // borderColor:
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
}

const styles = StyleSheet.create({
    input_wrapper: {
        height: 48,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    input_plus_wrapper: {
        marginTop: '3.148%',
        marginBottom: '3.518%',
        marginLeft: '4.629%',
        marginRight: '3.703%',
        width: '5.648%',
        height: '46.511%',
    },
    input_plus: {
        width: '100%',
        height: '50%',
        resizeMode: 'center',
    },
    input_chat_wrapper: {
        marginTop: '2.407%',
        marginBottom: '2.5%',
        width: '72.962%',
        paddingBottom: 15
    },
    input_chat: {
        width: '100%',
        fontSize: 20
    },
    input_send_wrapper: {
        marginTop: '2.87%',
        marginBottom: '2.777%',
        marginHorizontal: '2.777%',
        width: '7.314%',
        height: '52.713%',
    },
    input_send: {
        width: '100%',
        height: '50%',
        resizeMode: 'center',
    },

    member_status_wrapper:{
        marginHorizontal: '3.703%',
        backgroundColor: 'white',
        height: 57,
        borderRadius: 5,
        flexDirection: 'row',
    },
    member_icon_wrapper:{
        flex: 11,
    },
    member_icon:{
        marginLeft: '18.75%',
        marginRight: '6.25%',
        marginVertical: '51.818%',
        height: '28.125%',
        width: '75%',
        resizeMode: 'contain',
    },
    member_wrapper:{
        flex: 80,
        flexDirection: 'row'
    },
    spread_icon_wrapper:{
        flex: 9,
    },
    spread_icon:{
        marginLeft: '5.555%',
        marginRight: '52.222%',
        width: '42.222%',
        marginVertical: '75.555%',
        height: '15.625%',
        resizeMode: 'contain',
    },

    profile_wrapper: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    profile_icon_wrapper: {
        marginTop: '9.375%',
        marginBottom: '6.25%',
        width: '50%',
        height: '62.5%',
    },
    profile_icon:{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 100,
    },
    profile_text_wrapper: {
        marginBottom: '6.25%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profile_text: {
        fontSize: 7,
        color: '#999999'
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
    chat_area: {
        paddingVertical : 30
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
    text_modal_content: {
        fontSize: RFValue(16),
        color: "#787878", 
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
        height: 30
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
    modal_content_wrapper: {
        flex:4,
        /* backgroundColor: 'red' */
    },
    modal_content_area: {
        flex:1,
        justifyContent:'center',
    },
    modal_input_area: {
        flex:3,
        /* backgroundColor: 'purple', */
        flexDirection:'row',
        alignItems: 'center'
    },
    modal_input_info_area: {
        flex:1,
    },
    text_modal_title: {
        fontSize: RFValue(20)
    },
    modal_input_wrapper: {
        flex: 5,
        flexDirection: 'row',
        /* backgroundColor: 'green', */
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal_input_wrapper_wrapper: {
        flex:1,
        paddingRight: "10%",
        paddingLeft: "10%",
        /* backgroundColor: 'blue', */
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_wrapper: {
        width: '100%',
        height: 68,
        marginBottom: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        backgroundColor: 'white',
    }, // 358 359 358
    btn_gallery_wrapper:{
        width: '33.148%',
    },
    btn_gallery_icon_wrapper:{
        marginHorizontal: '39.385%',
        width: '21.229%',
        marginTop: '7.821%',
        marginBottom: '5.027%',
        height: '42.011%',
        borderColor: 'black',
        borderWidth: 1,
    },
    btn_gallery:{
        width: '100%',
        height: '75%',
        resizeMode: 'contain'
    },
    btn_gallery_text_wrapper:{
        marginLeft: '41.061%',
        marginRight: '41.34%',
        width: '17.877%',
        borderColor: 'black',
        borderWidth: 1
    },
    btn_dutch_wrapper:{
        width: '33.148%',
    },
    btn_dutch_icon_wrapper:{
        marginLeft: '37.15%',
        marginRight: '37.43%',
        width: '25.418%',
        marginTop: '7.821%', //28
        marginBottom: '4.748%', //17
        height: '42.011%', //71
        borderColor: 'black',
        borderWidth: 1,
    },
    btn_dutch:{
        width: '100%',
        height: '75%',
        resizeMode: 'contain'
    },
    btn_dutch_text_wrapper:{
        marginLeft: '37.15%',
        marginRight: '37.43%',
        width: '25.418%',
        borderColor: 'black',
        borderWidth: 1,
    },
    // btn_dutch_text:{
    //     sd,
    // },
    btn_endInvite_wrapper:{
        width: '33.148%',
    },
    btn_endInvite_icon_wrapper:{
        marginLeft: '37.142%',
        marginRight: '40.782%',
        width: '24.935%',
        marginTop: '6.983%',
        marginBottom: '7.262%',
        height: '44.97%',
        borderColor: 'black',
        borderWidth: 1,
    },
    btn_endInvite: {
        width: '100%',
        height: '75%',
        resizeMode: 'contain'
    },
    btn_endInvite_text_wrapper:{
        marginLeft: '38.368%',
        marginRight: '35.474%',
        width: '26.256%',
        borderColor: 'black',
        borderWidth: 1,
    },
    // btn_endInvite_text: {
    //     sds,
    // },
    bar: {
        width: '0.185%', //2
        marginTop: '3.055%', //33
        marginBottom: '3.148%',    // 34
        height: '59.763%',//101
        backgroundColor: "#CCCCCC",
    },
    underBar: {
        width: '100%', //2
        height: '59.763%',//101
        backgroundColor: "#CCCCCC",
    },
})
