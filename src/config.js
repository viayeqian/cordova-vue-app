/**
 * 不同业务或项目的页面，切换router引用重新运行即可
 * */
import router from './router/'

var userId = '',
  mblNo = '';
if (window) {
  userId = window.localStorage.getItem('userId') || 1
  mblNo = window.localStorage.getItem('mblNo') || 1
}

/**
 * 通用化的app配置
 * */
export default {
  host: 'https://uatapp.banacoo.cn/',
  up_host: 'http://ui.banacoo.cn/sunnyui/',
  indexPath: ['/', '/home','/order','/mine'],
  router: router,
  userId: userId,
  mblNo: mblNo
}
