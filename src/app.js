import Vue from 'vue'
import App from './app.vue'
import router from './router/index'

// 手写的模块
import print from './print.js'
print()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App) // vue的render函数,该渲染函数接收一个 createElement(h) 方法作为第一个参数用来创建 VNode
})

if (module.hot) {
  module.hot.accept('./print.js', function () {
    console.log('HMR接口')
    print()
  })
}
