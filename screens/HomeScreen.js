import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View,ScrollView ,RefreshControl} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize"
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import Select from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';
import SendBird from 'sendbird'
import Spinner from 'react-native-loading-spinner-overlay'
const today = new Date()
export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        // this.nickname = this.props.route.params.nickname
        this.state = {
            ModalCreateChatVisible : false,
            ModalEnterChatVisible : false,
            appearKeyboard  : false,
            selectedStartLocation : undefined,
            selectedEndLocation : undefined,
            selectedHours: today.getHours() > 12 ? today.getHours()-12 : today.getHours(),
            selectedMinutes: undefined,
            selectedMeridiem : today.getHours() < 12 ? 'AM' : 'PM',
            selectedChattingRoom : {},
            chattingRooms : [],
            isRefreshing: true,
            spinner: false,
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
    }
    componentDidMount() {
        const self = this
        header.headerRight = ()=>(
            <TouchableOpacity style={{width:50}} onPress={()=>self.handleRefresh()}>
                <Icon
                    name="refresh"
                    size={30}
                    color="black"
                />
            </TouchableOpacity>
        )
        this.props.navigation.setOptions(header)
        this.handleRefresh()
    }
    selectStartLocation(location) {
        this.setState({selectedStartLocation:location})
    }
    selectEndLocation(location) {
        this.setState({selectedEndLocation:location})
    }
    selectHour(selectedHours) {
        this.setState({selectedHours})
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
    parseTime(selectedHours,selectedMinutes,selectedMeridiem) {
        let today_timestamp = new Date(today.toDateString()).getTime()
        today_timestamp += 1000 * 60 * 60 * selectedHours
        today_timestamp += 1000 * 60 * selectedMinutes
        today_timestamp += selectedMeridiem == 'AM' ?  0 : 1000 * 60 * 60 * 12
        return today_timestamp
    }
    createChattingRoom() {
        const {selectedStartLocation,selectedEndLocation,selectedHours,selectedMinutes,selectedMeridiem} = this.state
        if(!selectedStartLocation || !selectedEndLocation){
            alert('장소를 선택해주세요')
            return
        }
        if(selectedMinutes === undefined) {
            alert('시간을 설정해주세요')
            return
        }
        
        this.setState({spinner:!this.state.spinner})
        const startTime = this.parseTime(selectedHours,selectedMinutes,selectedMeridiem)
        const curTime = new Date().getTime()

        if(startTime - curTime < (1000 * 60 * 5)){
            alert('시간이 너무 촉박합니다\n다시 설정해주세요')
            this.setState({spinner:!this.state.spinner})
            return
        }
        const This = this
        this.sb.OpenChannel.createChannel("타이틀", "", "", [] ,'', (openChannel, error) => {
            if (error) {
                this.setState({spinner:!this.state.spinner})
                return;
            }

            const data = {
                userName : this.nickname,
                startTime : startTime+'',
                startLocation : this.state.selectedStartLocation,
                arriveLocation : this.state.selectedEndLocation,
                isFrozen : 'false',
                url: openChannel.url
            }
            // console.log(data)
            //This.handleRefresh()
            This.toggleModalCreateChat()
            this.setState({spinner:!this.state.spinner})
            openChannel.createMetaData(data).then((res)=>{
                this.props.navigation.navigate('Chat', data)
            })
        })
    }

    enterChattingRoom(){
        this.setState({ModalEnterChatVisible : !this.state.ModalEnterChatVisible})
        //console.log(this.state.selectedChattingRoom)
        this.props.navigation.navigate('Chat', this.state.selectedChattingRoom)
    }


    renderChattingRooms(){
        return this.state.chattingRooms.map((channelData, idx)=>{
            if(!channelData.url){
                return <View key={idx} />
            }
            return ((channelData.isFrozen)==='false')
            ? <ChattingRoom key={idx} channelData={channelData} handlePressList={(channelData)=>this.handlePressList(channelData)} />
            : <View key={idx} />
        })
    }

    handleRefresh(){
        this.setState({isRefreshing: !this.state.isRefreshing})
        let openChannelListQuery = this.sb.OpenChannel.createOpenChannelListQuery();
        const self=this

        this.setState({
            chattingRooms: []
        })
        openChannelListQuery.next((openChannels, error) => {
            openChannels.reduce( async (acc,cur)=>{
                const response = await acc
                if(response){
                    self.setState(state=>{
                        state.chattingRooms.push(response)
                        return state
                        //chattingRooms: [...self.state.chattingRooms,response]
                    })
                }
                return cur.getAllMetaData()
            },Promise).then(response=>self.setState({
                chattingRooms: [...self.state.chattingRooms,response]
            }))
            /* response data 설명
                response = {
                    arriveLocation: "도착시간",
                    isFrozen: "true or false, 모집완료 유무",
                    startLocation: "출발 지역",
                    startTime: "합승 출발 시각",
                    url: "채널 url",
                    userName: "생성 유저 네임"
            } */
            self.setState({isRefreshing: !self.state.isRefreshing})
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
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={{color: '#FFF'}}
                />
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
                                    selectedHours={this.state.selectedHours}
                                    selectMinutes={(value)=>this.selectMinutes(value)}
                                    selectedMinutes={this.state.selectedMinutes}
                                    selectMeridiem={(value)=>this.selectMeridiem(value)}
                                    selectedMeridiem={this.state.selectedMeridiem}
                                    createChattingRoom={()=>this.createChattingRoom()}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profile_wrapper}>
                            <TouchableOpacity style={styles.bottom_icon_wrapper} onPress={() => this.props.navigation.navigate('Profile',this.nickname)}>
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
        for(let i=0; i<=12; i++){
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
                <View style={{flex:6}}></View>
                <View style={{flex:7,backgroundColor:'white',padding : 25,borderRadius:10}}>
                    <View style={styles.modal_title_create_area}>
                        <Text style={styles.text_modal_title}>새로운 동행</Text>
                    </View>
                    <View style={styles.modal_location_area}>
                        <View style={styles.modal_startLocation_create_wrapper}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>출발</Text>
                            </View>
                            <View style={styles.select_wrapper}>
                                <Select
                                    onValueChange={(value) => props.selectStartLocation(value)}
                                    placeholder={{ label: '출발장소',value :null,color: '#CCCCCC'}}
                                    //style={}
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
                            <View style={{flex:2,justifyContent: 'center',alignItems:'center'}}><Text style={{fontSize:RFValue(16)}}>시각</Text></View>
                            <View style={{flex:2,justifyContent: 'center',alignItems:'center'}}>
                                <Select
                                    onValueChange={(value) => props.selectHour(value)}
                                    placeholder={{ label: '', value: props.selectedHours ,color: 'white'}}
                                    style={{}}
                                    items={hourItem()}
                                />
                                <Text style={{position: 'absolute',left:10}}>{props.selectedHours < 10 ? '0'+props.selectedHours : props.selectedHours}</Text>
                            </View>
                            <View style={{flex:2,justifyContent: 'center',alignItems:'center'}}>
                                <Select
                                    onValueChange={(value) => props.selectMinutes(value)}
                                    placeholder={{ label: '',value : null,color: 'white'}}
                                    style={{}}
                                    items={minutesItem()}
                                />
                                <Text style={{position: 'absolute',left:10}}>{props.selectedMinutes}</Text>
                            </View>
                            <View style={{flex:2,justifyContent: 'center',alignItems:'center'}}>
                                <Select
                                    onValueChange={(value) => props.selectMeridiem(value)}
                                    placeholder={{ label: '',value: props.selectedMeridiem ,color: 'white'}}
                                    style={{}}
                                    items={[
                                        {label:'AM',value:'AM'},
                                        {label:'PM',value:'PM'}
                                    ]}
                                />
                                <Text style={{position: 'absolute',left:5}}>{props.selectedMeridiem}</Text>
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
                <View style={{flex:6}}></View>
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
        this.remaingTime = this.getRemainingTime(this.props.channelData.startTime)
    }
    getRemainingTime(departureTime){
        if(typeof(departureTime) === 'string') {
            departureTime *=1
        }
        let difference = departureTime - new Date().getTime()
        let hour = 0
        let minute = 0
        if(difference <= 0) {
            return `모집 종료`
        }
        while (difference >= 3600000) {
            hour++
            difference -= 3600000
        }
        while (difference >= 60000) {
            minute++
            difference -= 60000
        }
        if (hour <= 0) {
            if (minute <= 0) {
            return `곧 출발`
            } else {
            return `${minute + 1}분 전`
            }
        } else {
            return `${hour}시간\n ${minute + 1}분 전`
        }
    }

    parseTime(timestamp){
        if(typeof(timestamp)==='string'){
            timestamp = timestamp*1
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
                <TouchableOpacity
                    style={styles.row_wrapper}
                    onPress={()=>this.remaingTime !== '모집 종료' ? this.props.handlePressList(this.props.channelData) : null} >
                    <View style={styles.icon_area}>
                        <View style={styles.icon_wrapper}>
                            <Image
                                source={require('../assets/images/car.png')}
                                style={styles.icon_img}
                            />
                        </View>
                        <View styles={{flex:1}}>
                            <Text style={styles.text_nickname}>{this.props.channelData.userName}</Text>
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
                            <Text style={{color:'red'}}> {this.remaingTime}</Text>
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
    modal_title_create_area: {
        flex:2,
        /* backgroundColor:"green", */
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    modal_location_area: {
        flex:5,
        /* backgroundColor:"yellow", */
    },
    modal_time_area: {
        flex:5,
        marginTop: 10,
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
        flexDirection: 'row',
        height : RFValue(28),
    },
    modal_startLocation_create_wrapper: {
        flexDirection: 'row',
        height : RFValue(28),
        marginBottom: RFValue(8)
    },
    modal_EndLocation_wrapper: {
        flexDirection: 'row',
        height : RFValue(28),
    },
    modal_Time_wrapper: {
        flex:1,
        flexDirection: 'row',
    },
    modal_text_wrapper: {
        flex:3,
        justifyContent:'center',
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
        justifyContent:'center',
        alignItems: 'center',
        borderRadius:4,
        borderColor:'#dcdcdc',
        height : RFValue(28),
        paddingLeft: RFValue(12)
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
        height : '75%',
        resizeMode : 'contain',
    }
})