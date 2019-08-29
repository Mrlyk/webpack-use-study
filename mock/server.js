const express = require('express')
const bodyParser = require('body-parser') // Express内置的中间件,帮助我们解析前端的请求,将解析出来的内容挂载在req.body上
const multipart = require('connect-multiparty') // 处理文件上传的模块,会在服务器生成临时文件,需要注意生成的临时文件不会自己删除,需要我们使用完之后手动删除.

const config = require('./config.js')
const multipartMiddleware = multipart()
const app = express()
app.use(bodyParser.urlencoded({ extend: false }))
app.use(bodyParser.json())

// 自定义端口
let port = 9999
process.argv.forEach((arg, index, arr) => {
  if (arg === '--port') {
    port = arr[index + 1] || 9999
    return false
  }
})

module.exports = app.listen(port, () => {
  console.log('Mock Server listening on http://localhost:9999')
})

/** 添加mock数据和路由处理逻辑 */
// 定义mock方法
const mock = (data, params) => {
  if (Object.prototype.toString.call(data) === '[object object]') {
    return data
  } else if (typeof data === 'function') {
    return data(params)
  } else {
    return 'error:data should be an object or a function'
  }
}

// mock数据. 实际上在接口多的时候将不同的接口作为单独的响应模块拆分更好,这里放入./data中
/**
 const getUserInfo = {
  code: 0,
  message: "success",
  data: {
    name: "lyk",
    mobile: "178xxxxx9999",
    age: "18"
  }
}
 */
// 路由和数据的聚合. 同上将他抽离出来放在单独的配置文件中./config.js
/**
const config = [
  {
    method: "get",
    url: "/api/getUserInfo",
    data: getUserInfo
  }
]
*/
// 绑定路由信息
config.forEach(({ method, url, data }) => {
  if (method === 'get') {
    app.get(url, (req, res) => {
      res.json(mock(data, req.query))
    })
  } else if (method === 'post') {
    app.post(url, multipartMiddleware, (req, res) => {
      res.json(mock(data, req.body))
    })
  } else if (method === 'jsonp') {
    app.get(url, (req, res) => {
      const query = req.query
      const mockData = JSON.stringify(mock(data, req.query))
      const callback = `typeof ${query.callback} === function && ${query.callback(mockData)}`
      res.send(callback)
    })
  }
})
