import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Select from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';
import SendBird from 'sendbird'
import { StackActions, NavigationActions } from 'react-navigation';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            ChattingRoomList : [1,2,3,4,5,6,7],
            ModalCreateChatVisible : false,
            ModalEnterChatVisible : false,
            appearKeyboard  : false,
            selectedStartLocation : '',
            selectedEndLocation : '',
            selectedTime : '09:00 AM',
            selectedChattingRoom : {},
            chattingRoomList2 : [],
            userName : '익명이'
        }
        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.sb.connect(this.state.userName, (user, error) => {})
        this.props.navigation.setOptions(header)
    }
    componentDidMount() {
        if(this.props.route.params !== 'init'){
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                    { name: 'Home',key: null,params:'init' },
                    ],
                })
            )
        }
        this.handleRefresh()
    }
    selectStartLocation(location) {
        this.setState({selectedStartLocation:location})
    }

    selectEndLocation(location) {
        this.setState({selectedEndLocation:location})
    }

    handlePressList(channelData){
        this.setState({
            ModalEnterChatVisible : !this.state.ModalEnterChatVisible,
            selectedChattingRoom : channelData,
        })
    }
    createChattingRoom() {
        const data = {
            adminName : this.state.userName,
            startTime : '09:00 AM',
            startLocation : this.state.selectedStartLocation,
            arriveLocation : this.state.selectedEndLocation,
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

    renderChattingRooms(chattingRoomList){
        return chattingRoomList.map((channel,idx)=>{
            const info = JSON.parse(channel.data)
            const channelData = {
                userName : this.state.userName,
                url : channel.url,
                startTime : info.startTime,
                startLocation : info.startLocation,
                arriveLocation : info.arriveLocation
            }
            return <ChattingRoom key={idx} channelData={channelData} handlePressList={(channelData)=>this.handlePressList(channelData)} />
        })
    }

    handleRefresh(){
        let openChannelListQuery = this.sb.OpenChannel.createOpenChannelListQuery();
        const This = this
        openChannelListQuery.next(function(openChannels, error) {
            if (error) {
                return;
            }
            This.setState({
                chattingRoomList2 : openChannels
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
                <ScrollView onRefresh={()=>alert('hello')}>
                    {this.renderChattingRooms(this.state.chattingRoomList2)}
                </ScrollView>
                <Button
                    icon={
                        <Icon
                            name="arrow-right"
                            size={15}
                            color="white"
                        />
                        }
                    buttonStyle={styles.button}
                    containerStyle={styles.button_container}
                    title=""
                    titleStyle = {{color : 'black',fontWeight : 'bold'}}
                    onPress={() => this.handleRefresh()}
                />
                <ModalEnterChat
                    ModalEnterChatVisible={this.state.ModalEnterChatVisible}
                    toggleModalEnterChat={()=>this.toggleModalEnterChat()}
                    enterChattingRoom={()=>this.enterChattingRoom()}/>
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
                                    selectStartLocation={(location)=>this.selectStartLocation(location)}
                                    selectEndLocation={(location)=>this.selectEndLocation(location)}
                                    toggleModalCreateChat={()=>this.toggleModalCreateChat()}
                                    createChattingRoom={()=>this.createChattingRoom()}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profile_wrapper}>
                            <TouchableOpacity style={styles.bottom_icon_wrapper} onPress={() => this.props.navigation.navigate('ResetPw')}>
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
    return (
        <Modal isVisible={props.ModalCreateChatVisible}>
            <View style={styles.modal_wrapper}>
                <View style={{height:400,backgroundColor:'white',padding : 25,borderRadius:10}}>
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
                                    style={{flex:1}}
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
                        <View style={styles.modal_button_area}>
                            <Button titleStyle={{color:'black'}} type="clear" title="취소" onPress={()=>props.toggleModalCreateChat()} />
                            <View style={{width:16}}></View>
                            <Button titleStyle={{color:'black'}} type="clear" title="확인" onPress={()=>props.createChattingRoom()} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

function ModalEnterChat(props){
    return (
        <Modal isVisible={props.ModalEnterChatVisible}>
            <View style={styles.modal_enterChat_wrapper}>
                <View style={{height:230,backgroundColor:'white',padding : 25,borderRadius:10}}>
                    <View style={styles.modal_title_area}>
                        <Text style={styles.text_modal_title}>동행 요청</Text>
                    </View>
                    <View style={styles.modal_location_area}>
                        <View style={styles.modal_startLocation_wrapper}>
                            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>출발</Text>
                            </View>
                            <View style={styles.modal_text_wrapper}>
                                <Text style={{fontSize:RFValue(15),color:'#A6A6A6'}}>출발장소</Text>
                            </View>
                        </View>
                        <View style={styles.modal_EndLocation_wrapper}>
                            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16)}}>도착</Text>
                            </View>
                            <View style={styles.modal_text_wrapper}>
                                <Text style={{fontSize:RFValue(15),color:'#A6A6A6'}}>도착장소</Text>
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
                    <View style={styles.modal_time_area}>
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
                            <Text style={{color:'gray'}}>{this.props.channelData.startTime}</Text>
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
        flex:4,
        /* backgroundColor:"green", */
        justifyContent: 'center',
    },
    modal_location_area: {
        flex:10,
        /* backgroundColor:"yellow", */
    },
    modal_time_area: {
        flex:4,
        /* backgroundColor:"blue", */
    },
    modal_button_area: {
        flex:3,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
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
        paddingTop: 100,
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
