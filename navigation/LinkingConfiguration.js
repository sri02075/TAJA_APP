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
      /* screens : {
        SignUp : 'SignUp'
      } */
    },
    ResetPw : {
      path : 'login/resetPw',
      /* screens : {
        ResetPw : 'ResetPw'
      } */
    },
    Chat : {
      path : 'home/chat',
    },
    Home : {
      path : 'home'
    }
  },
};
