import config from '../config'
import cookie from 'vue-cookie'

const headers = {
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'Content-Type': 'application/json; charset=UTF-8'
}

var request = {
  POST (url, data, param = {checkLogin: true}) {
    if (!url) {
      console.error('Don`t have request url.')
      return
    }
    if (param.checkLogin) {
      return request.checkSession().then(res => {
        if (res)
          return request.doPost(url, data, param)
      }).catch(err => {
        err && console.log(err)
      })
    } else {
      return request.doPost(url, data, param)
    }
  },
  /**
   * param:{
   *   host:
   *   headers:
   *   checkLogin: true
   * }
   * */
  doPost (url, data, param) {
    url = (param.host ? param.host : config.host) + url
    let mHeaders = Object.assign({},headers)
    if (param.headers) Object.assign(mHeaders,param.headers)
    if (param.checkLogin) mHeaders['x-auth-token'] = cookie.get('sessionId')
    return fetch(url ,{
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, same-origin, *omit
      headers: mHeaders
    }).then(res => {
      if (res.ok) {
        let result = res.json()
        return result.then(r => {
          console.log(url, r)
          return new Promise(resolve => {
            resolve(r)
          })
        })
      } else {
        alert('连接失败，请重试')
      }
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 检查是否有登陆信息，或登陆信息是否过期
   * */
  checkSession () {
    return new Promise((resolve, reject) => {
      let sessionValid = cookie.get('sessionValid')
      let sessionId = cookie.get('sessionId')
      if (!sessionId) {
        config.router.push('/login')
        return reject('don`t have loginMsg, please login!')
      }

      if (!sessionValid) {
        /**
         * session is expired, Do resetSession!
         * */
        request.resetSession(sessionId).then(r => {
          if (r.code == 'FSP0000') {
            cookie.set('sessionValid',true,{expires: '1.5h'})
            cookie.set('sessionId',r.data.sessionId)
            return resolve(true)
          } else {
            config.router.push('/login')
            return reject('loginMsg is error, please login!')
          }
        })
      } else {
        return resolve(true)
      }
    })
  },
  /***
   * 重置sessionId
   * @param oldSession
   * @returns {*}
   */
  resetSession (oldSession) {
    let userId = window.localStorage.getItem('userId')
    let data = {
      userType: 'APP',
      userId: userId,
      loginCode: oldSession
    }
    return request.POST('resetSession', data ,{
      checkLogin:false
    })
  }
}

export default {
  POST: request.POST
}
