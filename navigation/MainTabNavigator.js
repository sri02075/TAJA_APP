import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { CommonActions } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import LoginScreen from '../screens/LoginScreen';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Main';

export default function MainTabNavigator({ navigation, route }) {
  console.log(navigation,route)
  navigation.setOptions({ headerTitle: getHeaderOptions(route) });
  /* */
  /* navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: 'main' }
      ],
    })
  ); */
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Main"
        component={HomeScreen}
        options={{
          title: 'Get Started',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
      {/* <BottomTab.Screen/> */}
      <BottomTab.Screen
        name="Links"
        component={LoginScreen}
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderOptions(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  console.log('routeName : '+routeName)
  switch (routeName) {
    case 'Main':
      return '동행';
    case 'Links':
      return 'Links to learn more';
  }
}

function pullDownRefresh(){

}

function getHeaderButton(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  if(routeName === 'Main'){
    return <Button title="Update count" />
  }
  return null
}