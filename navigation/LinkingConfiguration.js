import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    Login : {
      path : 'login',
    },
    SignUp : {
      path : 'login/signUp',
    },
    ResetPw : {
      path : 'login/resetPw',
    },
    Home : {
      path : 'home'
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
