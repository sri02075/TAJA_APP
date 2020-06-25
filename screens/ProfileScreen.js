import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { RFValue } from "react-native-responsive-fontsize"
import Modal from 'react-native-modal'


export default class ProfileScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isModalVisible: false,
            selected: 0,
            // isEmailModalVisible: false,
            // isAccountNumberModalVisible: false,
            // isFriendsListModalVisible: false,
            // isNoteModalVisible: false,
            // isTheNumberOfAccompainedModalVisible: false,
            // isManageAccountModalVisible: false,
        }
    }

    toggleModal(i) {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            selected: i
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.profile_area}>
                    <View style={{flex: 9}}></View>
                    <View style={styles.profile_information_wrapper}>
                        <View style={{flex: 23, borderWidth: 1, borderColor: 'white', aspectRatio: 1, borderRadius: 1000}}>
                            
                        </View>
                        <View style={{flex: 8, justifyContent: 'flex-end',}}>
                            <Text style={{fontSize: RFValue(20), fontWeight: '700'}}>AUTC</Text>
                        </View>
                    </View>
                    <View style={{flex: 22}}></View>
                </View>{/* 12 */}
                <View style={styles.setting_area}>
                    <View style={styles.setting_list_wrapper}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.toggleModal(0)}>
                            <View style={styles.setting_list_content}>
                                <Icon
                                    name="envelope"
                                    size={28}
                                    color="white"
                                />
                                <Text style={styles.setting_list_text}>
                                    이메일
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.setting_list_wrapper}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.toggleModal(1)}>
                            <View style={styles.setting_list_content}>
                                <Icon
                                    name="money"
                                    size={28}
                                    color="white"
                                />
                                <Text style={styles.setting_list_text}>
                                    계좌번호
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.setting_list_wrapper}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.toggleModal(2)}>
                            <View style={styles.setting_list_content}>
                                <Icon
                                    name="star"
                                    size={28}
                                    color="white"
                                />
                                <Text style={styles.setting_list_text}>
                                    친구목록
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.setting_list_wrapper}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.toggleModal(3)}>
                            <View style={styles.setting_list_content}>
                                <Icon
                                    name="comment"
                                    size={28}
                                    color="white"
                                />
                                <Text style={styles.setting_list_text}>
                                    쪽지
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.setting_list_wrapper}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.toggleModal(4)}>
                            <View style={styles.setting_list_content}>
                                <Icon
                                    name="car"
                                    size={28}
                                    color="white"
                                />
                                <Text style={styles.setting_list_text}>
                                    동행횟수
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.setting_list_footer_wrapper}>
                        <TouchableOpacity style={{flex: 1}} onPress={()=>this.toggleModal(5)}>
                            <View style={styles.setting_list_content}>
                                <Icon
                                    name="clipboard"
                                    size={28}
                                    color="white"
                                />
                                <Text style={styles.setting_list_text}>
                                    계정관리
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>{/* 23 */}
                <ModalList isVisible={this.state.isModalVisible} selected={this.state.selected} toggleModal={()=>{this.toggleModal(this.state.selected)}}/>
            </View>
            );
        }
}

class ModalList extends React.Component {
    constructor(props){
        super(props)
        // this.props.toggleModal()
    }
    render(){
        return(
            <View>
                <Modal isVisible={(this.props.isVisible && this.props.selected === 0)}>
                    <View style={{flex: 1}}></View>
                    <View style={{flex: 1, backgroundColor: 'white', borderRadius: 10}}>
                        <View style={{flex: 1}}></View>
                        <View style={styles.modal_button_area}>
                            <Button title="취소" type="clear" onPress={()=>{this.props.toggleModal()}} />
                            <Button title="확인" type="clear" onPress={()=>{this.props.toggleModal()}} />
                        </View>
                    </View>
                    <View style={{flex: 1}}></View>
                </Modal>
                {/* <Modal isVisible={this.props.isVisible && selected == 1}>
                    <View style={{flex: 1}}>
                        <Text>계좌번호</Text>
                        <Button title="확인" onPress={()=>{this.props.toggleModal()}} />
                    </View>
                </Modal>
                <Modal isVisible={this.props.isVisible && selected == 2}>
                    <View style={{flex: 1}}>
                        <Text>친구목록</Text>
                        <Button title="확인" onPress={()=>{this.props.toggleModal()}} />
                    </View>
                </Modal>
                <Modal isVisible={this.props.isVisible && selected == 3}>
                    <View style={{flex: 1}}>
                        <Text>쪽지</Text>
                        <Button title="확인" onPress={()=>{this.props.toggleModal()}} />
                    </View>
                </Modal>
                <Modal isVisible={this.props.isVisible && selected == 4}>
                    <View style={{flex: 1}}>
                        <Text>동행횟수</Text>
                        <Button title="확인" onPress={()=>{this.props.toggleModal()}} />
                    </View>
                </Modal>
                <Modal isVisible={this.props.isVisible && selected == 5}>
                    <View style={{flex: 1}}>
                        <Text>계정관리</Text>
                        <Button title="확인" onPress={()=>{this.props.toggleModal()}} />
                    </View>
                </Modal> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    profile_area: {
        flex: 12,
    },
    setting_area: {
        flex: 23,
        backgroundColor: 'green',
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "5%",
    },
    profile_information_wrapper: {
        flex: 31,
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 5,
    },
    setting_list_wrapper: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "white",
        flexDirection: 'row',
        alignItems: 'center',
    },
    setting_list_content : {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    setting_list_footer_wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    setting_list_text: {
        marginLeft: 20,
        color: "white",
    },
    modal_button_area: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 10,
    },
});
