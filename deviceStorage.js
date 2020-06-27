import { AsyncStorage } from 'react-native';

const deviceStorage = {
    // our AsyncStorage functions will go here :)
    async saveItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
        }
    },
    async getItem(key){
        let token
        try {
            token = await AsyncStorage.getItem(key,(err,value) => {
                return value
            })
        } catch (error) {
        }finally {
            return token
        }
    }
};

export default deviceStorage;