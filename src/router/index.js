import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/hello.vue'
import About from '../components/about.vue'

Vue.use(Router)
export default new Router({
    routes:[
        {
            name:'Hello',
            path:'/hello',
            component:Hello
        },
        {
            name:'about',
            path:'/about',
            component:About
        }
    ]
})
