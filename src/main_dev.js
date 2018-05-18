import Vue from 'vue'
import App from './App'
import config from './config'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import theme from './theme'
Vue.use(Vuetify, theme)

import vueCookie from 'vue-cookie'
Vue.use(vueCookie)

import yyApi from './core/yy-api'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI)

const router = config.router

Vue.config.productionTip = false
config.host = '/api/'
window.yy = yyApi
window.yy.config = config

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
