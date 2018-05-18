import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import theme from './theme'
Vue.use(Vuetify, theme)

import vueCookie from 'vue-cookie'
Vue.use(vueCookie)

import esSixPromise from 'es6-promise'
import 'isomorphic-fetch'
esSixPromise.polyfill()


import App from './App'
import config from './config'
import yyApi from './core/yy-api'

// MintUI
// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI)

Vue.config.productionTip = false

const router = config.router

var backClick = 0;
var timeOutCount = '';

var app = {
  init () {
    app.bindEvent( () => {
      // console.log(appVersion)
      app.bindVue()
    })
  },
  bindVue () {
    navigator.splashscreen.hide()
    new Vue({
      el: '#app',
      router,
      template: '<App />',
      components: { App }
    })
  },
  bindEvent (cb) {
    document.addEventListener('deviceready', () => {this.onDeviceReady(cb)}, false);
    document.addEventListener('pause', this.onPause, false);
    document.addEventListener('resume', this.onResume, false);
    document.addEventListener("backbutton", this.onBackButton, false);
  },
  onDeviceReady (cb) {
    // 应用程序开始运行
    console.log('Device is ready...')

    window.yy = yyApi
    window.yy.config = config
    !window.cordova && alert('系统不兼容，请联系客服')
    window.QRScanner.prepare()
    typeof cb === 'function' && cb()
  },
  onPause (event) {
    // 应用程序移动到背景
    console.log('onPause', event)
  },
  onResume (event) {
    // 应用程序返回到背景
    console.log('onResume', event)
  },
  /**
   * 点击返回按钮
   * @param event
   */
  onBackButton (event) {
    let curRoute = router.currentRoute
    console.log(router.currentRoute)
    // stopBack 为true，意味着不需要触发 onBackButton 事件
    if (curRoute.meta.stopBack) return

    // stopBackOnce 为true，意味着需要阻止 onBackButton 事件一次，结束后还原为false即可
    if (curRoute.meta.stopBackOnce) {
      curRoute.meta.stopBackOnce = false
      return
    }

    if (curRoute.meta.backBtnForCloseDiolag) {
      curRoute.meta.backBtnForCloseDiolag = false
      yy.hideDialog()
      return
    }

    if (config.indexPath.indexOf(curRoute.path) !== -1) {
      // 处于首页
      if (backClick) {
        if(timeOutCount) clearTimeout(timeOutCount)
        navigator.app.exitApp()
      } else {
        window.plugins.toast.showWithOptions({
          message: "再按一次退出应用",
          duration: 2500, // 2000 ms
          position: "bottom",
          addPixelsY: -150
        })
        backClick++
        timeOutCount = setTimeout(function () {
          backClick = 0
        },2500)
      }
    } else {
      router.go(-1)
    }
  }
}

app.init()
