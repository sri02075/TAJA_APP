import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    /* Root: {
      path: 'root',
      screens: {
        Home: 'home',
        Links: 'links',
      },
    }, */
    Login : {
      path : 'login',
    },
    SignUp : {
      path : 'login/signUp',
    },
    ResetPw : {
      path : 'login/resetPw',
    },
    Chat : {
      path : 'home/chat',
    },
    Home : {
      path : 'home'
    },
    Profile: {
      path: 'home/profile',
    }
  },
};
