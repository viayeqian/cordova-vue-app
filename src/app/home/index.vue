<template>
  <v-app>
    <div class="layout">
      <div class="header">
        <v-toolbar color="toolbar" flat>
          <v-toolbar-title class="black--text" >BanaCoo</v-toolbar-title>
        </v-toolbar>
      </div>
      <div class="content">
        <transition :name="transitionName">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
      <div class="bottom">
        <v-bottom-nav :value="true" :active.sync="e1" color="transparent">
          <v-btn flat color="primary" value="home" to="home" replace>
            <span class="black--text index" >首页</span>
            <img class="index-icon" src="../../assets/home/home-highlight.png" v-if="e1 == 'home'">
            <img class="index-icon" src="../../assets/home/home-normal.png" v-else>
          </v-btn>
          <!--<v-btn flat color="primary" value="order" :to="checkLogin() ? 'order' : '/login'" :replace="checkLogin()">-->
            <!--<span class="black&#45;&#45;text">订单</span>-->
            <!--<v-icon>list</v-icon>-->
          <!--</v-btn>-->
          <v-btn flat color="primary" value="mine" :to="checkLogin() ? 'mine' : '/login'" :replace="checkLogin()">
            <span class="black--text index">我的</span>
            <img class="index-icon" src="../../assets/home/my-highlight.png" v-if="e1 == 'mine'">
            <img class="index-icon" src="../../assets/home/my-normal.png" v-else>
          </v-btn>
        </v-bottom-nav>
      </div>
    </div>
  </v-app>
</template>

<script>
  import Config from '../../config'

  export default {
    name: "index",
    data () {
      return {
        e1: 'home',
        transitionName: 'slide-right'
      }
    },
    mounted () {
      this.e1 = this.$route.path.split('/')[1]
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        const indexPath = Config.indexPath

        let toIndex = indexPath.indexOf(to.path)
        let fromIndex = indexPath.indexOf(from.path)

        this.transitionName = toIndex > fromIndex ? 'slide-left' : 'slide-right'
      }
    },
    methods: {
      checkLogin() {
        return window.yy.checkLoginInfo()
      }
    }
  }
</script>

<style scoped>
  .slide-go-enter-active,
  .slide-go-leave-active,
  .slide-back-enter-active,
  .slide-back-leave-active {
    will-change: transform;
    transition: all .5s;
    position: absolute;
  }
  .slide-go-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-go-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-back-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-back-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .index-icon{
    width: 30px;
    height: 30px;
  }
  .index{
    font-size: 12px;
    padding-top: 4px;
  }
  .header >>> .toolbar__content{
    justify-content: center;
  }
</style>
