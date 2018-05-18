<template>
  <v-app>
    <div class="layout">
      <div class="header">
        <v-toolbar color="primary">
          <v-btn icon @click.prevent="$router.go(-1)" style="z-index: 999">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="black--text">购物流程</v-toolbar-title>
        </v-toolbar>
      </div>
      <div class="content">
        <div class="f-col" style="width:100%;">
          <img src="../../assets/shopProcess/buy-process.jpg" alt="流程图" style="width: 100%;">
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
  export default {
    name: "shop-process",
    methods:{
    }
  }
</script>

<style scoped>
  .header .toolbar{
    box-shadow: none;
    position: relative;
  }
  .black--text{
    position: absolute;
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
</style>
