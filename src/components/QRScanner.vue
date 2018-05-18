<template>
  <v-app>
    <v-layout>
      <v-toolbar color="primary">
        <v-btn icon @click.prevent="goBack">
          <v-icon class="black--text">arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="black--text">扫描中...</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <div class="scanModal">
          <span class="angles top-lf"></span>
          <span class="angles top-rt"></span>
          <span class="angles bot-lf"></span>
          <span class="angles bot-rt"></span>
          <div class="light-btn" @click="toggleLight">轻触{{openLight === false ? '照亮' : '关闭'}}</div>
        </div>
      </v-content>
    </v-layout>
    <v-dialog v-model="showDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">温馨提示</v-card-title>
        <v-card-text>我们无权访问您的相机，请前往设置开启相机权限</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" flat @click.native="goBack()">拒绝</v-btn>
          <v-btn color="primary" flat @click.native="authorized()">前往</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
  import router from '../router/index'
  /* eslint-disable */
  export default {
    name: 'QRScanner',
    data () {
      return {
        openLight: false,
        scanSuccess: false,
        showDialog: false
      }
    },
    mounted () {
      this.showScanner()
    },
    beforeDestroy () {
      this.close()
    },
    methods: {
      goBack () {
        router.go(-1)
      },
      close (e) {
        this.hideScanner()
        !this.scanSuccess && yy.emit('closeQRScanner')
        e && e.preventDefault()
      },
      showScanner: function () {
        if (!window.QRScanner) {
          console.log('showScanner: not found QRScanner')
          return
        }
        window.QRScanner.prepare((err, status) => {
          if (err) {
            console.log('scanner prepare err', err)
          }
          console.log('scanner prepare status', status)
          if (status && status.authorized) {
            //授权使用相机，处理扫描事件
            this.scan()
          }else{
            this.showDialog = true
          }
        })
      },
      /**
       * 授权
       * */
      authorized () {
        window.QRScanner.getStatus(status => {
          if (status.canOpenSettings) {
            window.QRScanner.openSettings();
          } else {
            window.plugins.toast.showShortBottom('无法打开手机设置')
          }
          this.goBack()
        })
      },
      // 扫描
      scan () {
        window.QRScanner.show((status) => {
          console.log('scanner show success', status)
        })
        window.QRScanner.scan((err, text) => {
          if (err) {
            console.log('scanner scan err', err)
          }
          if (text) {
            console.log('scan text ', text)
            yy.emit('qrScanResult', text)
          }
          this.scanSuccess = true
          this.goBack()
        })
      },
      hideScanner () {
        if (!window.QRScanner) {
          console.log('hideScanner: not found QRScanner')
          return
        }
        window.QRScanner.hide()
      },
      toggleLight() {
        if(!window.QRScanner) {
          console.log('openLight: not found QRScanner')
          return
        }
        !this.openLight ? window.QRScanner.enableLight() : window.QRScanner.disableLight()
        this.openLight = !this.openLight
      }
    }
  }
</script>
<style scoped>
  .application{
    background: transparent!important;
  }
  .scanModal {
    box-shadow: 0px 0px 0px 100vh rgba(0,0,0,0.4);
    position: absolute;
    width: 280px;
    height: 280px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-80%);
    border: 1px solid #000;
  }
  .light-btn {
    position: absolute;
    font-size: 16px;
    line-height: 20px;
    left: 50%;
    bottom: -30px;
    transform: translateX(-50%);
    color: #fff;
    z-index: 99;
  }
  .angles {
    position: absolute;
    border-style: solid;
    border-color: #2196f3;
    padding: 20px;
  }
  .top-lf {
    border-width: 5px 0 0 5px;
    top: -5px;
    left: -5px;
  }
  .top-rt {
    border-width: 5px 5px 0 0;
    top: -5px;
    right: -5px;
  }
  .bot-lf {
    border-width: 0 0 5px 5px;
    bottom: -5px;
    left: -5px;
  }
  .bot-rt {
    border-width: 0 5px 5px 0;
    bottom: -5px;
    right: -5px;
  }
</style>
