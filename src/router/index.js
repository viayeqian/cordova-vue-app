import Vue from 'vue'
import Router from 'vue-router'
import HomeIndex from '@/app/home/index'
import Home from '@/app/home/home'
import Process from '@/app/home/shopProcess'
import Order from '@/app/order/order'
import OrderDetail from '@/app/order/details'
import Mine from '@/app/mine/mine'
import agreement from '@/app/mine/userAgreement'
import Login from '@/app/login'
import QRScanner from '@/components/QRScanner'
import Pay from '@/app/pay/index'
import PayResult from '@/app/pay/result'


Vue.use(Router)
/**
 * 增加meta属性  设置keepAlive为true时，页面将会缓存
 * */
export default new Router({
  routes: [
    {
      path: '/',
      component: HomeIndex,
      redirect: 'home',
      meta: {
        keepAlive: true
      },
      children: [{
        path: '/home',
        component: Home,
        meta:{
          keepAlive: true
        }
      }, {
        path: '/order',
        component: Order,
        meta:{
          keepAlive: true
        }
      }, {
        path: '/mine',
        component: Mine,
        meta:{
          keepAlive: true
        }
      }]
    }, {
      path: '/order/detail',
      component: OrderDetail
    },{
      path: '/agreement',
      component: agreement
    }, {
      path: '/pay',
      component: Pay
    }, {
      path: '/pay/result',
      component: PayResult,
    }, {
      path: '/process',
      component: Process
    }, {
      path: '/login',
      component: Login
    }, {
      path: '/QRScanner',
      component: QRScanner
    }
  ]
})
