import Vue from 'vue'
import App from './app.vue'
import router from './router/index'

new Vue({
    el:'#app',
    router,
    render: h => h(App) //vue的render函数,该渲染函数接收一个 createElement(h) 方法作为第一个参数用来创建 VNode
})
