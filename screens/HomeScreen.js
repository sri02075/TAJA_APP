import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            ChattingRoomList : [1,2,3,4,5,6,7],
            appearKeyboard  : false,
        }
        
    }

    renderChattingRooms(ChattingRoomList){
        return ChattingRoomList.map((el,idx)=>
            <ChattingRoom key={idx} />
            )
    }

    async handleRefresh(){
        //await api response
        const ChattingRoomList = [1,2]
        this.setState({ChattingRoomList})
    }

    render(){
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.renderChattingRooms(this.state.ChattingRoomList)}
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
                            <TouchableOpacity style={{flex:1,alignContent:'center'}} onPress={()=>alert('z')}>
                                <Icon
                                    name="arrow-right"
                                    size={48}
                                    color="white"
                                />
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

function ChattingRoom(props){
    return(
        <View style={styles.row}>
            <TouchableOpacity style={styles.row_wrapper}>
                <View style={styles.icon_area}>
                </View>
                <View style={styles.description_area}>
                    <View style={{flex:1}}></View>
                    <View style={styles.description}>
                        <Text style={styles.text_description_title}>출발 </Text>
                        <Text style={styles.text_description}> 안양역 1호선</Text>
                    </View>
                    <View style={styles.description}>
                        <Text style={styles.text_description_title}>도착 </Text>
                        <Text style={styles.text_description}> 안양대학교 후문</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
                <View style={styles.time_area}>
                    <View style={styles.time_wrapper}>
                        <Text style={{color:'red'}}>5분전</Text>
                        <Text style={{color:'gray'}}>오전 8:50</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
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
        zIndex: 999,
        backgroundColor:'red',
        position : "fixed",
        bottom: 0,
        flexDirection : 'row'
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
    }
});
