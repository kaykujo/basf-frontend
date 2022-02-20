import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import '@fortawesome/fontawesome-free/css/all.css'
import './assets/styles/main.scss'
import DefaultLayout from './layouts/Default.vue'
import API from './utils/api'
import Helper from './utils/helper'

Vue.use(API)
Vue.use(Helper)

Vue.component('default-layout', DefaultLayout)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')