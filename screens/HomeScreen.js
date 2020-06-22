import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Select from 'react-native-picker-select';
import SendBird from 'sendbird'

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            ChattingRoomList : [1,2,3,4,5,6,7],
            isModalVisible : false,
            appearKeyboard  : false,
            selectedStartLocation : '',
            selectedEndLocation : '',
            selectedTime : '09:00 AM',
            chattingRoomList2 : [],
            userName : '익명이'
        }
        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.sb.connect(this.state.userName, (user, error) => {})
    }

    componentDidMount() {
        this.handleRefresh()
    }

    createChattingRoom() {
        const data = {
            adminName : this.state.userName,
            startTime : 'START_TIME',
            startLocation : 'START_LOCATION',
            arriveLocation : 'ARRIVE_LOCATION'
        }
        const This = this
        this.sb.OpenChannel.createChannel("타이틀", "", JSON.stringify(data), [] ,'', (openChannel, error) => {
            if (error) {
                return;
            }
            This.handleRefresh()
            This.toggleModal()
        })
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
            return <ChattingRoom key={idx} channelData={channelData} me={this} />
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
    toggleModal = () => {
        this.setState({isModalVisible: !this.state.isModalVisible})
    }

    render(){
        return (
            <View style={styles.container}>
                <ScrollView>
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
                <View style={styles.bottom_area}>
                        <View style={styles.logo_wrapper}></View>
                        <View style={{flex:4}}></View>
                        <View style={styles.create_chat_wrapper}>
                            <TouchableOpacity style={{flex:1,alignContent:'center'}} onPress={()=>this.setState({isModalVisible:true})}>
                                <Icon
                                    name="arrow-right"
                                    size={48}
                                    color="white"
                                />
                                <Modal isVisible={this.state.isModalVisible}>
                                    <View style={styles.modal_wrapper}>
                                        <View style={{height:400,backgroundColor:'white',padding : 25}}>
                                            <View style={styles.modal_title_area}>
                                                <Text style={styles.text_modal_title}>새로운 동행</Text>
                                            </View>
                                            <View style={styles.modal_location_area}>
                                                <View style={styles.modal_startLocation_wrapper}>
                                                    <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                                                        <Text style={{fontSize:RFValue(16)}}>출발</Text>
                                                    </View>
                                                    <View style={{flex:3}}>
                                                        <Select
                                                            onValueChange={(value) => this.setState({selectedStartLocation : value})}
                                                            placeholder={{ label: '출발장소',value :null}}
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
                                                    <Select
                                                        onValueChange={(value) => this.setState({selectedEndLocation : value})}
                                                        placeholder={{label: '도착장소'}}
                                                        items={[
                                                            { label: '안양대 정문', value: '안양대 정문' },
                                                            { label: '안양대 후문', value: '안양대 후문' },
                                                            { label: '안양역', value: '안양역' },
                                                        ]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.modal_time_area}>
                                                <View style={styles.modal_button_area}>
                                                    <Button titleStyle={{color:'black'}} type="clear" title="취소" onPress={this.toggleModal.bind(this)} />
                                                    <View style={{width:16}}></View>
                                                    <Button titleStyle={{color:'black'}} type="clear" title="확인" onPress={this.createChattingRoom.bind(this)} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profile_wrapper}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ResetPw')}>
                                <Icon
                                    name="arrow-right"
                                    size={48}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                </View>
            </View>
        )
    }
}

class ChattingRoom extends React.Component {
    constructor(props){
        super(props)
        this.sb = new SendBird({appId: '27B3D61B-004E-4DB6-9523-D45CCD63EDFD'})
        this.sb.connect('익명이', (user, error) => {})
    }

    render() {
        return(
            <View style={styles.row}>
                <TouchableOpacity style={styles.row_wrapper} onPress={() => this.props.me.props.navigation.navigate('Chat', this.props.channelData)}>
                    <View style={styles.icon_area}>
                    </View>
                    <View style={styles.description_area}>
                        <View style={{flex:1}}></View>
                        <View style={styles.description}>
                            <Text style={styles.text_description_title}>출발 </Text>
                            <Text style={styles.text_description}>{this.props.channelData.startLocation}</Text>
                        </View>
                        <View style={styles.description}>
                            <Text style={styles.text_description_title}>도착 </Text>
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
HomeScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottom_area: {
        height: 48,
        width: "100%",
        backgroundColor:'red',
        bottom: 0,
        flexDirection : 'row'
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
        backgroundColor: 'purple',
    },
    modal_EndLocation_wrapper: {
        flex:1,
        flexDirection: 'row',
    },
    description: {
        flex : 2,
        flexDirection: 'row',
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
        backgroundColor: 'green',
    },
    create_chat_wrapper: {
        flex:1,
        backgroundColor: 'blue',
    },
    profile_wrapper: {
        flex:1,
        backgroundColor: 'yellow',
    },
    modal_wrapper: {
        flex:1,
        paddingTop: 100,
        paddingLeft : "10.18%",
        paddingRight : "10.18%",
        borderRadius : 100,
    }
});
