import Vue from 'vue'
import Router from 'vue-router'
import Threejs from '@/views/test/threejs.vue'
import Webgl from '@/views/demo/webgl'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'threejs',
      component: Threejs
    },
    {
      path: '/webgl',
      name: 'webgl',
      component: Webgl
    }
  ]
})