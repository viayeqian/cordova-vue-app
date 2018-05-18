<template>
  <div id="app">
    <v-app class="app-topest-dom">
      <transition :name="transitionName">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view />
        </keep-alive>
        <router-view v-else/>
      </transition>
      <v-dialog v-model="dialog.show" :persistent="dialog.persistent" max-width="290">
        <v-card>
          <v-card-title class="headline">{{dialog.title}}</v-card-title>
          <v-card-text>{{dialog.content}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="default" v-if="dialog.showCancel" flat @click.prevent="dialog.cancel">{{dialog.cancelText||'取消'}}</v-btn>
            <v-btn color="success" flat @click.prevent="dialog.sure">{{dialog.sureText||'确定'}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-progress-circular style="z-index: 999999;position: absolute;" class="full-loading f-center" v-if="showProgress"
                           indeterminate :size="50" color="primary"></v-progress-circular>

    </v-app>
  </div>
</template>

<script>
import './core/base.css'

const routersArr = ['/','/home']
export default {
  name: 'App',
  data () {
    return {
      transitionName: 'slide-right',
      showProgress: false,
      dialog: {
        show: false,
        title: '',
        content: '',
        showCancel: false,
        persistent: false
      }
    }
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      /**
       * routersArr 实现一个路由栈，to.path 存在表示返回，to.path 不存在表示前往
       */
      if (routersArr.indexOf(to.path) > -1) {
        //back
        this.transitionName = 'slide-right'
        from.path != '/home' && routersArr.splice(routersArr.indexOf(from.path),1)
      } else {
        //goto
        this.transitionName = 'slide-left'
        routersArr.push(to.path)
      }
    }
  },
  created () {
    this.showProgress = true
  },
  mounted () {
    yy.on('showDialog', (data) => {
      this.showDialog(data)
    })
    yy.on('hideDialog', () => {
      this.dialog.show = false
    })
    this.checkUpdate()
  },
  methods: {
    checkUpdate () {
      if (window.cordova) {
        window.cordova.getAppVersion.getVersionNumber().then(version => {
          // typeof cb === 'function' && cb(version)
          this.requestUpdate().then(r => {
            this.showProgress = false
            if (r.code == 0){
              if (String(version) < String(r.version.verNum)){
                this.updateUrl = r.verUrl
                this.showUpdateDialog()
              }
            } else {
              // alert('更新服务正在重启，请稍后再试')
              console.log('更新服务异常')
            }
          })
        })
      } else {
        this.requestUpdate().then(r => {
          this.showProgress = false
          let version = '1.0.0'
          if (r.code == 0){
            if (String(version) < String(r.version.verNum)){
              this.updateUrl = r.verUrl
              this.showUpdateDialog()
            }
          } else {
            // alert('更新服务正在重启，请稍后再试')
            console.log('更新服务异常')
          }
        })
      }
    },
    requestUpdate () {
      return yy.getAppNewestVersion()
    },
    showDialog (data) {
      this.dialog = this.initDialogData()
      Object.assign(this.dialog, data)

      this.dialog.cancel = () => {
        this.dialog.show = false
        this.$router.currentRoute.meta.backBtnForCloseDiolag = false
        setTimeout(() => {
          typeof data.cancel === 'function' && data.cancel()
        }, 300)
      }
      this.dialog.sure = () => {
        this.dialog.show = false
        this.$router.currentRoute.meta.backBtnForCloseDiolag = false
        setTimeout(() => {
          typeof data.sure === 'function' && data.sure()
        }, 300)
      }
    },
    initDialogData () {
      if (this.$router.currentRoute){
        this.$router.currentRoute.meta.backBtnForCloseDiolag = true
      }
      return {
        show: true,
        title: '',
        content: '',
        showCancel: false,
        persistent: false
      }
    },
    showUpdateDialog () {
      this.dialog = {
        show: true,
        title: '更新提示',
        content: '监测到新版本，请立即下载更新',
        persistent: true,
        sure () {
          window.location.href = this.updateUrl
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app-topest-dom {
  background: transparent!important;  /*不要修改这里的背景色，会影响扫码背景*/
}
  .app-progress-mask{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
</style>
