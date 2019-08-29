const getUserInfo = require('./data/getUserInfo.js')
const api = require('./api')
const config = [
  {
    method: 'get',
    url: api.getUserInfo,
    data: getUserInfo
  }
]

module.exports = config
