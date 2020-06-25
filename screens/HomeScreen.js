import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View,ScrollView ,RefreshControl} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize"
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import Select from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';
import SendBird from 'sendbird'

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        // this.nickname = this.props.route.params.nickname
        this.state = {
            ModalCreateChatVisible : false,
            ModalEnterChatVisible : false,
            appearKeyboard  : false,
            selectedStartLocation : '',
            selectedEndLocation : '',
            selectedHours: 8,
            selectedMinutes: 30,
            selectedMeridiem : 'AM',
            selectedTime : 1593189000000,
            selectedChattingRoom : {},
            chattingRoomList : [],
            isRefreshing: true,
        }

        const {token,nickname} = this.props.route.params
        this.nickname= nickname
        if(token.substring(0,6) !== 'Bearer'){
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                    { name: 'Home',key: null,params:{token: `Bearer ${token}`,nickname : nickname}},
                    ],
                })
            )
        }

        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.sb.connect(this.nickname, (user, error) => {})
        this.props.navigation.setOptions(header)
    }
    componentDidMount() {
        this.handleRefresh()
    }
    selectStartLocation(location) {
        this.setState({selectedStartLocation:location})
    }
    selectEndLocation(location) {
        this.setState({selectedEndLocation:location})
    }
    selectHour(selectedHour) {
        this.setState({selectedHour})
    }
    selectMinutes(selectedMinutes) {
        this.setState({selectedMinutes})
    }
    selectMeridiem(selectedMeridiem) {
        this.setState({selectedMeridiem})
    }
    handleOnChangeTime(date) {
        this.setState({selectedTime:date})
    }
    handlePressList(channelData){
        this.setState({
            ModalEnterChatVisible : !this.state.ModalEnterChatVisible,
            selectedChattingRoom : channelData,
        })
    }
    createChattingRoom() {
        const data = {
            adminName : this.nickname,
            startTime : this.state.selectedTime,
            startLocation : this.state.selectedStartLocation,
            arriveLocation : this.state.selectedEndLocation,
            isFrozen : false
        }
        const This = this
        this.sb.OpenChannel.createChannel("타이틀", "", JSON.stringify(data), [] ,'', (openChannel, error) => {
            if (error) {
                return;
            }
            This.handleRefresh()
            This.toggleModalCreateChat()
        })
    }

    enterChattingRoom(){
        this.setState({ModalEnterChatVisible : !this.state.ModalEnterChatVisible})
        this.props.navigation.navigate('Chat', this.state.selectedChattingRoom)
    }

    renderChattingRooms(){
        const self = this
        return this.state.chattingRoomList.map((channel,idx)=>{
            const info = JSON.parse(channel.data)
            const channelData = {
                userName : this.nickname,
                url : channel.url,
                startTime : info.startTime,
                startLocation : info.startLocation,
                arriveLocation : info.arriveLocation,
                isFrozen: info.isFrozen
            }
            return (info.isFrozen) 
                ? <ChattingRoom key={idx} channelData={channelData} handlePressList={(channelData)=>this.handlePressList(channelData)} />
                : <View />
        })
    }

    handleRefresh(){
        this.setState({isRefreshing: !this.state.isRefreshing})
        let openChannelListQuery = this.sb.OpenChannel.createOpenChannelListQuery();
        const This = this
        openChannelListQuery.next(function(openChannels, error) {
            if (error) {
                return;
            }
            This.setState({
                chattingRoomList : openChannels,
                isRefreshing: !This.state.isRefreshing,
            })
        })
    }

    toggleModalCreateChat = () => {
        this.setState({ModalCreateChatVisible: !this.state.ModalCreateChatVisible})
    }

    toggleModalEnterChat = () => {
        this.setState({ModalEnterChatVisible: !this.state.ModalEnterChatVisible})
    }
    render(){
        return (
            <View style={styles.container}>

                <ScrollView refreshControl={<RefreshControl refreshing={!this.state.isRefreshing} onRefresh={()=>this.handleRefresh()} />}>
                    {this.renderChattingRooms()}
                </ScrollView>
                <ModalEnterChat
                    ModalEnterChatVisible={this.state.ModalEnterChatVisible}
                    toggleModalEnterChat={()=>this.toggleModalEnterChat()}
                    enterChattingRoom={()=>this.enterChattingRoom()}
                    selectedChattingRoom={this.state.selectedChattingRoom}
                    selectedHours={this.state.selectedHours}
                    selectedMinutes={this.state.selectedMinutes}/>
                <View style={styles.bottom_area}>
                        <View style={styles.logo_wrapper}>
                            <Image
                                source={require('../assets/images/taja_logo.png')}
                                style={styles.logo_img}
                            />
                        </View>
                        <View style={{flex:4}}></View>
                        <View style={styles.create_chat_wrapper}>
                            <TouchableOpacity style={styles.bottom_icon_wrapper} onPress={()=>this.setState({ModalCreateChatVisible:true})}>
                                <Icon
                                    name="plus"
                                    size={28}
                                    color="#ffb000"
                                />
                                <ModalCreateChat
                                    ModalCreateChatVisible={this.state.ModalCreateChatVisible}
                                    toggleModalCreateChat={()=>this.toggleModalCreateChat()}
                                    onChange={(hour,minutes)=>this.handleOnChangeTime(hour,minutes)}
                                    selectStartLocation={(value)=>this.selectStartLocation(value)}
                                    selectEndLocation={(value)=>this.selectEndLocation(value)}
                                    selectHour={(value)=>this.selectHour(value)}
                                    selectedMinutes={(value)=>this.selectedMinutes(value)}
                                    selectedMeridiem={(value)=>this.selectedMeridiem(value)}
                                    createChattingRoom={()=>this.createChattingRoom()}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profile_wrapper}>
                            <TouchableOpacity style={styles.bottom_icon_wrapper} onPress={() => this.props.navigation.navigate('Profile')}>
                                <Icon
                                    name="user-o"
                                    size={28}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                </View>
            </View>
        )
    }
}
function ModalCreateChat(props){
    const hourItem = ()=>{
        const hourItemArray = []
        for(let i=1; i<=12; i++){
            hourItemArray.push({label: `${i<10 ? '0'+i : i}`, value: i})
        }
        return hourItemArray
    }
    const minutesItem = ()=>{
        const hourItemArray = []
        for(let i=0; i<=55; i+=5){
            hourItemArray.push({label: `${i<10 ? '0'+i : i}`, value: i})
        }
        return hourItemArray
    }
    return (
        <Modal isVisible={props.ModalCreateChatVisible}>
            <View style={styles.modal_wrapper}>
                <View style={{flex:1}}></View>
                <View style={{flex:2,backgroundColor:'white',padding : 25,borderRadius:10}}>
                    <View style={styles.modal_title_area}>
                        <Text style={styles.text_modal_title}>새로운 동행</Text>
                    </View>
                    <View style={styles.modal_location_area}>
                        <View style={styles.modal_startLocation_wrapper}>
                            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>출발</Text>
                            </View>
                            <View style={styles.select_wrapper}>
                                <Select
                                    onValueChange={(value) => props.selectStartLocation(value)}
                                    placeholder={{ label: '출발장소',value :null,color: '#CCCCCC'}}
                                    style={{flex:1}}
                                    items={[
                                        { label: '안양역', value: '안양역' },
                                        { label: '안양대 정문', value: '안양대 정문' },
                                        { label: '안양대 후문', value: '안양대 후문' },
                                    ]}
                                />
                            </View>
                        </View>
                        <View style={styles.modal_EndLocation_wrapper}>
                        <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>도착</Text>
                            </View>
                            <View style={styles.select_wrapper}>
                                <Select
                                    onValueChange={(value) => props.selectEndLocation(value)}
                                    placeholder={{ label: '도착장소',value :null,color: '#CCCCCC'}}
                                    style={{flex:1,paddingLeft:15}}
                                    items={[
                                        { label: '안양대 정문', value: '안양대 정문' },
                                        { label: '안양대 후문', value: '안양대 후문' },
                                        { label: '안양역', value: '안양역' },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.modal_time_area}>
                        <View style={styles.modal_timePicker_wrapper}>
                            <View style={{flex:2,backgroundColor:'red',justifyContent: 'center',alignItems:'center'}}><Text style={{fontSize:RFValue(16)}}>시각</Text></View>
                            <View style={{flex:2,backgroundColor:'blue',justifyContent: 'center',alignItems:'center'}}>
                                <Select
                                    onValueChange={(value) => props.selectHour(value)}
                                    placeholder={{ label: '시간',value :null,color: '#CCCCCC'}}
                                    style={{flex:1,paddingLeft:15}}
                                    items={hourItem()}
                                />
                            </View>
                            <View style={{flex:2,backgroundColor:'green',justifyContent: 'center',alignItems:'center'}}>
                                <Select
                                    onValueChange={(value) => props.selectMinutes(value)}
                                    placeholder={{ label: '분',value :null,color: '#CCCCCC'}}
                                    style={{flex:1,paddingLeft:15}}
                                    items={minutesItem()}
                                    useNativeAndroidPickerStyle={false}
                                />
                            </View>
                            <View style={{flex:2,backgroundColor:'yellow',justifyContent: 'center',alignItems:'center'}}>
                                <Select
                                    onValueChange={(value) => props.selectMeridiem(value)}
                                    placeholder={{ label: 'AM,PM',value :null,color: '#CCCCCC'}}
                                    style={{flex:1,paddingLeft:15}}
                                    items={[
                                        {label:'AM',value:'AM'},
                                        {label:'PM',value:'PM'}
                                    ]}
                                />
                            </View>
                            {/* <TimePicker onTimeSelected={(date)=>{props.onChange(date)}}/> */}
                        </View>
                        <View style={styles.modal_createButton_area}>
                            <Button titleStyle={{color:'black'}} type="clear" title="취소" onPress={()=>props.toggleModalCreateChat()} />
                            <View style={{width:16}}></View>
                            <Button titleStyle={{color:'black'}} type="clear" title="확인" onPress={()=>props.createChattingRoom()} />
                        </View>
                    </View>
                </View>
                <View style={{flex:1}}></View>
            </View>
        </Modal>
    )
}

function ModalEnterChat(props){
    return (
        <Modal isVisible={props.ModalEnterChatVisible}>
            <View style={styles.modal_enterChat_wrapper}>
                <View style={{height:230,backgroundColor:'white',padding : 25,paddingTop: 0 ,borderRadius:10}}>
                    <View style={styles.modal_title_area}>
                        <Text style={styles.text_modal_title}>동행 요청</Text>
                    </View>
                    <View style={styles.modal_description_area}>
                        <View style={styles.modal_startLocation_wrapper}>
                            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>출발</Text>
                            </View>
                            <View style={styles.modal_text_wrapper}>
                                <Text style={{fontSize:RFValue(15),color:'#A6A6A6'}}>{props.selectedChattingRoom.startLocation} </Text>
                            </View>
                        </View>
                        <View style={styles.modal_EndLocation_wrapper}>
                            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>도착</Text>
                            </View>
                            <View style={styles.modal_text_wrapper}>
                                <Text style={{fontSize:RFValue(15),color:'#A6A6A6'}}>{props.selectedChattingRoom.arriveLocation}</Text>
                            </View>
                        </View>
                        <View style={styles.modal_Time_wrapper}>
                            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>시각</Text>
                            </View>
                            <View style={styles.modal_text_wrapper}>
                                <Text style={{fontSize:RFValue(15),color:'#A6A6A6'}}>09:00 AM</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.modal_last_area}>
                        <View style={styles.modal_button_area}>
                            <Button titleStyle={{color:'black'}} type="clear" title="취소" onPress={()=>props.toggleModalEnterChat()} />
                            <View style={{width:16}}></View>
                            <Button titleStyle={{color:'black'}} type="clear" title="확인" onPress={()=>props.enterChattingRoom()} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

class ChattingRoom extends React.Component {
    constructor(props){
        super(props)
        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.sb.connect('익명이', (user, error) => {})
    }
    getRemainingTime(departureTime){
        
    }

    parseTime(timestamp){
        if(typeof(timestamp)==='string'){
            return timestamp
        }
        const date = new Date(timestamp)
        const departureTime =  {
            hour : date.getHours() > 12 ? date.getHours()-12 : date.getHours(),
            minutes : date.getMinutes(),
            meridiem : date.getHours() > 12 ? 'PM' : 'AM',
        }
        const {hour,minutes,meridiem} = departureTime
        return `${hour<10 ? '0'+hour: hour}:${minutes} ${meridiem}`
    }
    render() {
        /*  */
        return(
            <View style={styles.row}>
                <TouchableOpacity style={styles.row_wrapper} onPress={()=>this.props.handlePressList(this.props.channelData)} >
                    <View style={styles.icon_area}>
                        <View style={styles.icon_wrapper}>
                            <Image
                                source={require('../assets/images/taja_logo.png')}
                                style={styles.logo_img}
                            />
                        </View>
                        <View styles={{flex:1}}>
                            <Text style={styles.text_nickname}>택시타자</Text>
                        </View>
                    </View>
                    <View style={styles.description_area}>
                        <View style={{flex:1}}></View>
                        <View style={styles.description}>
                            <Text style={styles.text_description_title}>출발   </Text>
                            <Text style={styles.text_description}>{this.props.channelData.startLocation}</Text>
                        </View>
                        <View style={styles.description}>
                            <Text style={styles.text_description_title}>도착   </Text>
                            <Text style={styles.text_description}>{this.props.channelData.arriveLocation}</Text>
                        </View>
                        <View style={{flex:1}}></View>
                    </View>
                    <View style={styles.time_area}>
                        <View style={styles.time_wrapper}>
                            <Text style={{color:'red'}}>5분전</Text>
                            <Text style={{color:'gray'}}>{this.parseTime(this.props.channelData.startTime)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
const header = {
    title: '동행',
    headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 2,
    },
    headerTintColor: 'black',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
}
HomeScreen.navigationOptions = {
    header: header,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottom_area: {
        height: 48,
        width: "100%",
        backgroundColor:'#0d1f37',
        bottom: 0,
        flexDirection : 'row'
    },
    modal_title_area: {
        flex:2,
        /* backgroundColor:"green", */
        marginTop: 30,
        justifyContent: 'flex-start',
    },
    modal_location_area: {
        flex:5,
        /* backgroundColor:"yellow", */
    },
    modal_time_area: {
        flex:5,
        marginTop: 10
    },
    modal_description_area: {
        flex:5,
        /* backgroundColor:"yellow", */
    },
    modal_last_area: {
        flex:2,
        /* backgroundColor:"blue", */
    },
    modal_createButton_area: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    modal_button_area: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    modal_timePicker_wrapper: {
        flex:1,
        flexDirection: 'row',
    },
    row: {
        height : 100,
        /* backgroundColor: 'red', */
        borderBottomWidth: 1,
        borderBottomColor: '#dcdcdc',
    },
    row_wrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    icon_area: {
        flex: 2,
        /* backgroundColor: 'blue', */
    },
    description_area: {
        flex: 5,
        /* backgroundColor: 'yellow', */
    },
    time_area: {
        flex: 2,
        /* backgroundColor: 'pink', */
    },
    time_wrapper: {
        flex: 1,
        /* backgroundColor: 'pink', */
        alignItems: 'flex-end',
        paddingRight: 15,
        paddingTop: 25
    },
    modal_startLocation_wrapper: {
        flex:1,
        flexDirection: 'row',
        marginBottom: 5,
    },
    modal_EndLocation_wrapper: {
        flex:1,
        flexDirection: 'row',
    },
    modal_Time_wrapper: {
        flex:1,
        flexDirection: 'row',
    },
    modal_text_wrapper: {
        flex:3,
        justifyContent:'center'
    },
    description: {
        flex : 2,
        flexDirection: 'row',
    },
    text_nickname: {
        fontSize:  RFValue(11),
        color : "gray",
        letterSpacing : -1,
        textAlign: 'center',
        marginBottom: 10,
    },
    text_description_title: {
        fontSize:  RFValue(11),
        fontWeight: '600',
        letterSpacing : -1,
    },
    text_description: {
        fontSize:  RFValue(11),
        color : "gray",
        letterSpacing : -1,
    },
    text_modal_title: {
        fontSize: RFValue(18),
        fontWeight: '600',
        letterSpacing : -1,
    },
    button : {
        backgroundColor : "#ffb000",
        borderRadius : 8,
    },
    button_container: {
        height: 55,
        width: 50,
        zIndex : 999,
        position : "absolute",
        right: 0,
        bottom: 100,
    },
    logo_wrapper: {
        flex:1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    create_chat_wrapper: {
        flex:1,
        marginRight: 5,
    },
    profile_wrapper: {
        flex:1,
        marginRight: 5,
    },
    bottom_icon_wrapper: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    modal_wrapper: {
        flex:1,
        justifyContent: 'center',
        paddingLeft : "10.18%",
        paddingRight : "10.18%",
        borderRadius : 100,
    },
    modal_enterChat_wrapper: {
        flex:1,
        paddingLeft : "10.18%",
        paddingRight : "10.18%",
        borderRadius : 100,
        justifyContent: 'center'
    },
    select_wrapper: {
        flex:3,
        borderWidth: 1,
        marginTop:8,
        justifyContent:'center',
        borderRadius:4,
        borderColor:'#dcdcdc'
    },
    icon_wrapper: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo_img : {
        width : '75%',
        height : '60%',
        resizeMode : 'contain',
    },
    icon_img: {
        width : '75%',
        height : '60%',
        resizeMode : 'contain',
    }
});