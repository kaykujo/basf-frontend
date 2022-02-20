import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  }]
})

export default router