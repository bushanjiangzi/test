import Vue from 'vue'
import Router from 'vue-router'
import Threejs from '@/views/test/threejs.vue'
import Webgl from '@/views/demo/webgl.vue'
import Cube from '@/views/demo/cube.vue'
import Login from '@/views/indexedDB/login.vue'
import Module from '@/views/indexedDB/module.vue'
import Gltf from '@/views/indexedDB/gltf.vue'
import Gltf2 from '@/views/indexedDB/gltf2.vue'

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
    },
    {
      path: '/cube',
      name: 'Cube',
      component: Cube
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/module',
      name: 'Module',
      component: Module
    },
    {
      path: '/gltf',
      name: 'Gltf',
      component: Gltf
    },
    {
      path: '/gltf2',
      name: 'Gltf2',
      component: Gltf2
    }
  ]
})