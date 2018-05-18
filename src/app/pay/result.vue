<template>
  <v-app>
    <div class="layout">
      <div class="header">
        <v-toolbar color="primary" flat="">
          <v-btn floating icon @click.prevent="$router.go(-1)" style="z-index: 999">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="black--text">支付结果</v-toolbar-title>
        </v-toolbar>
      </div>
      <div class="content">
        <v-container class="f-col f-center" style="margin-top: 150px;">
          <v-icon class="f-col" color="primary" size="100">check_circle</v-icon>
          <v-text class="pay f-col">支付成功,正在为您开门...</v-text>
        </v-container>
      </div>
      <!--<div class="bottom f-row" v-if="goodslist.length > 0">-->
        <!--<v-btn @click.prevent="cancelPay" class="pay">取消支付</v-btn>-->
        <!--<v-btn @click.prevent="doBestPay" class="pay">翼支付</v-btn>-->
      <!--</div>-->
    </div>
    <v-progress-circular style="z-index: 999999;" class="full-loading f-center" v-if="false"
                         indeterminate :size="50" color="primary"></v-progress-circular>
  </v-app>
</template>

<script>
    export default {
        name: "result"
    }
</script>

<style scoped>
  .black--text{
    position: absolute;
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  .pay{
    font-size: 20px;
    margin-top: 15px;
    color: #000;
    font-weight: 600;
  }
</style>
