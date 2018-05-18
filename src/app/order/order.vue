<template>
  <v-container style="margin: 0">
    <div class="order-header">
      <span>我的订单</span>
      <div class="text-xs-right downMent">
        <v-menu offset-y>
          <v-btn small flat depressed slot="activator">
            <span>最近</span>
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="item in items" :key="item.title" @click="">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-list two-line class="order-list">
      <template >
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title class="order-address">万达金街店</v-list-tile-title>
            <v-list-tile-sub-title class="text--primary">2018-04-15 14:30</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text class="price">总价 <span>￥30</span></v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
        <div>
          <div class="order-item">西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、</div>
          <div  class="order-btn">
            <v-btn round>
              <img src="../../assets/order/buycar.png">
              <span>详情</span>
            </v-btn>
          </div>
        </div>
      </template>
    </v-list>

    <v-list two-line class="order-list">
      <template >
        <v-list-tile class="list-tile">
          <v-list-tile-content>
            <v-list-tile-title class="order-address">购物时间</v-list-tile-title>
            <v-list-tile-sub-title class="text--primary">2017-11-11</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text class="price">总价 <span>￥30</span></v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
        <div class="f-col">
          <div class="order-title">万达金街店</div>
          <div class="order-item">西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、西瓜、南瓜、口香糖、橡皮擦、人头马、</div>
          <div class="order-btn">
            <v-btn round>
              <img src="../../assets/order/buycar.png">
              <span>详情</span>
            </v-btn>
          </div>
        </div>
      </template>
    </v-list>
  </v-container>
</template>

<script>
    export default {
        name: "order" ,
      data: () => ({
        items: [
          { title: '一周' },
          { title: '二周' },
          { title: '三周' },
          { title: '四周' }
        ]
      })
    }
</script>

<style scoped>
  .order-header{
    display: flex;
    justify-content: space-between;
  }
  .order-header span{
    font-size: 20px;
    color: #000000;
  }
  .downMent span{
    font-size: 14px;
  }
  .order-list{
    margin-bottom: 15px;
  }
  .order-address{
    font-size: 18px;
    color: #000;
  }
  .text--primary{
    font-size: 14px;
    color: #888 !important;
  }
  .price{
    font-size: 20px;
    color: #000;
  }
  .price span{
    color: #ff0000;
  }
  .list-tile{
    margin-bottom: 10px;
    border-bottom: 1px dashed #d7ccc8;
  }
  .order-item{
    height: 35px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 0px 16px 10px 16px;
    font-size: 10px;
    color: #bbb;
  }
  .order-title{
    color: #bbb;
    margin: 0px 16px 0px 16px;
  }
  .order-btn{
    display: flex;
    justify-content: flex-end;
  }
  .order-btn button{
    width: 80px;
    height: 30px;
    background-color: #FFE224!important;
  }
  .order-btn span{
    color: #000;
  }
  .order-btn img{
    width: 20px;
    height: 20px;
  }
</style>
