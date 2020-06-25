'user strict'
const axios = require('axios')
/* basepath = https://api.taja.awmaker.com/
response header key: Access-Control-Allow-Origin
response header value: *
response 포맷: JSON */
const axios = axios.create({
    baseURL : "https://api.taja.awmaker.com",
    withCredentials: true,
    headers: {
        Authorization : 'bearer accessKey',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

const api =
{
    login : {},
}

module.exports = setting