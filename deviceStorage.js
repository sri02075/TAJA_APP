import { AsyncStorage } from 'react-native';

const deviceStorage = {
    // our AsyncStorage functions will go here :)
    async saveItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    },
    async getItem(key){
        let token
        try {
            token = await AsyncStorage.getItem(key,(err,value) => {
                return value
            })
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }finally {
            return token
        }
    }
};

export default deviceStorage;