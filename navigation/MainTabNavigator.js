import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { CommonActions } from '@react-navigation/native';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import LoginScreen from '../screens/LoginScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'main';

export default function MainTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: 'Test' },
        {
          name: 'test',
          params: {},
        },
      ],
    })
  );
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="main"
        component={HomeScreen}
        options={{
          title: 'Get Started',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
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

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
  }
}
