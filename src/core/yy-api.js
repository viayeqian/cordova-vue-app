import Vue from 'vue'
import config from '../config'
import requestUnit from './requestUtil'
import cookie from "vue-cookie";

/**
 * 自定义api
 *
 * 简单实现消息的全局发布和监听，以及部分组件的调用api
 * */

const globalBus = new Vue()
const yyApi = {
  POST: requestUnit.POST,
  emit (event, data) {
    globalBus.$emit(event, data)
  },
  on (event, cb) {
    if(typeof cb !== 'function') {
      console.error('on event "',event,'" don`t have cb function')
      return
    }
    globalBus.$on(event, cb)
  },
  once (event, cb) {
    if(typeof cb !== 'function') {
      console.error('$once event "',event,'" don`t have cb function')
      return
    }
    globalBus.$once(event, cb)
  },
  showLoading () {
    yyApi.emit('showLoading')
  },
  hideLoading () {
    yyApi.emit('hideLoading')
  },
  showSnackbar (param) {
    yyApi.emit('showSnackbar', param)
  },
  showDialog (param) {
    yyApi.emit('showDialog', param)
  },
  hideDialog () {
    yyApi.emit('hideDialog')
  },
  /***
   * 打开 QRScanner
   * @param param
   * @constructor
   */
  QRScanner (param) {
    if (typeof param !== 'object'){
      console.error('请传入正确的参数')
      return
    }
    config.router.push('/QRScanner')

    yyApi.once('qrScanResult', param.success)

    if(typeof param.fail !== 'function'){
      param.fail = () => {
        yyApi.showSnackbar({
          type: 'error',
          text: '取消扫码'
        })
      }
    }
    yyApi.once('closeQRScanner', param.fail)
  },
  /**
   * 获取app的最新版本号
   * */
  getAppNewestVersion () {
    let data = {appId: 2}
    let url = config.up_host + 'appintf/findversion'
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': '*'
      }
    }).then((res) => {
      if (res.ok) {
        return res.json()
      }
    }).catch( err => {
      console.log(err)
    })
  },
  setLoginInfo (sessionId) {
    cookie.set('sessionId', sessionId)
    cookie.set('sessionValid',true,{expires: '1.5h'})
  },
  /***
   * 检查是否在登陆中，返回false，则需要跳转到登陆页面
   * @returns {boolean}
   */
  checkLoginInfo () {
    let sessionId = cookie.get('sessionId')
    return sessionId ? true : false
  }
}

export default yyApi
