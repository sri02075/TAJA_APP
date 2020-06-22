import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React,{useState}  from 'react';
import { Platform, StatusBar, StyleSheet, View ,Keyboard } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import MainTabNavigator from './navigation/MainTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ResetpwScreen from './screens/ResetpwScreen';
import ChatScreen from './screens/ChatScreen'
import deviceStorage from './deviceStorage.js';

const Stack = createStackNavigator();

export default function App(props) {
    const [token,setToken] = useState('test');
    const isLoadingComplete = useCachedResources();

    const updateToken = (token)=>{
        setToken(token)
    }
    if (!isLoadingComplete) {
        return null;
    } else {
        return (
        <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
            <NavigationContainer linking={LinkingConfiguration}>
            <Stack.Navigator
                initialRouteName="Login"
            >
                <Stack.Screen name="Login" component={LoginScreen} options={headerOption} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ResetPw" component={ResetpwScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
            </NavigationContainer>
        </View>
        );
    }
}
const headerOption = {
    title: 'My home',
    headerStyle: {
        backgroundColor: '#fff',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    };
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
