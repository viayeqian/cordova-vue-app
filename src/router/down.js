import Vue from 'vue'
import Router from 'vue-router'
import DownLoad from '@/app/downLoad'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: 'download'
  },{
    path: '/download',
    component: DownLoad
  }]
})
