'user strict'
const axios = require('axios')
const setting = 
{
    api : axios.create({
            baseURL : "https://guestbook.test.moonjang.net",
            withCredentials: true,
            headers: {
                Authorization : 'bearer accessKey',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }),
}

module.exports = setting