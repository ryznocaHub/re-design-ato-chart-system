<template>
  <div class="timeline-block">
  <ul :class="device.mobile ? 'timeline-mobile' : 'timeline'">
    <li :class="[{'active': this.cartStore.getters.cartStatus <= 1},{'until-active': this.cartStore.getters.cartStatus >= 2}]" @click="this.cartStore.commit('updateCartStatus',1)"><span><b class="number">01</b>カート</span></li>
    <li :class="[{'active': this.cartStore.getters.cartStatus == 2},{'until-active': this.cartStore.getters.cartStatus >= 3}]" @click="this.cartStore.commit('updateCartStatus',2)"><span><b class="number">02</b>{{device.mobile ? '支払方法' : 'お支払い方法確認'}}</span></li>
    <li :class="[{'active': this.cartStore.getters.cartStatus == 3},{'until-active': this.cartStore.getters.cartStatus >= 4}]" @click="this.cartStore.commit('updateCartStatus',3)"><span><b class="number">03</b>{{device.mobile ? '内容確認' : 'ご購入内容の確認'}}</span></li>
    <li :class="[{'active': this.cartStore.getters.cartStatus == 4},{'until-active': this.cartStore.getters.cartStatus >= 5}]" @click="this.cartStore.commit('updateCartStatus',4)"><span><b class="number">04</b>配布物確認<div v-if="this.cartStore.getters.uploadCount > 0"  class="maru" ><p class="v-center" v-text="this.cartStore.getters.uploadCount" ></p></div></span></li>
    <li :class="[{'active': this.cartStore.getters.cartStatus == 5},{'until-active': this.cartStore.getters.cartStatus >= 6}]" @click="this.cartStore.commit('updateCartStatus',5)"><span><b class="number">05</b>配布物の納品<div v-if="this.cartStore.getters.shippingCount > 0" class="maru"><p class="v-center" v-text="this.cartStore.getters.shippingCount"></p></div></span></li>
  </ul>
  </div>
</template>
<script>
import {cartStore} from "@/store/cart-store.js";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
export default {
  name: "TimeLine",
  data(){
    return {
      cartStore,
      device,
    }
  },
  method:{
    cartStatusIsOne(){
      console.log("methodTest")
      console.log(this.cartStore.getters.cartStatus)
      return this.cartStore.getters.cartStatus == 1;
    },
  }
}
</script>

<style scoped lang="scss">
$base-color: #FF8C00;


.timeline-block{
  width: 100%;
  text-align: right;
}
.timeline {
  margin-top: 100px;
  padding: 0;
  list-style: none;
  width: 1200px;
  margin-left: calc((100% - 1200px) * 0.5);
  counter-reset: step;
  overflow: visible;
  // height: 20px;
  // list-style-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq55vmk96OzLVhod2ZeIOSv-PpIG_8e19_Ng&usqp=CAU');
}


.timeline-mobile{
  @extend .timeline;
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}

.timeline li {
  float: left;
  text-align: center;
  width: 240px;
  // background: greenyellow;
  // color: $base-color;
  position: relative;
  overflow: visible;
}

.timeline-mobile li{
  float: left;
  text-align: center;
  width: 20%;
  position: relative;
  overflow: visible;
}

.timeline li span{
  position:relative;
  top: -80px;
}

.timeline li .number{
  font-weight: bold;
  margin-right: 5px;
}

.timeline li:before {
  content: "";
  // counter-increment: step;
  line-height: 35px;
  width: 35px;
  height: 35px;
  display: block;
  border-radius: 100%;
  border: 2px solid #EDC594;
  margin: 0 auto 15px auto;
  background: #fff;
  position: relative;
  overflow: visible;

}
/*
.timeline-mobile li:before {
  content: counter(step);
  counter-increment: step;
  line-height: 35px;
  width: 35px;
  height: 35px;
  display: block;
  border-radius: 100%;
  border: 1px solid #CCC;
  margin: 0 auto 15px auto;
  background: #fff;
  position: relative;
  overflow: visible;
}*/

.timeline li:after {

  content: '';
  width: 180px;
  height: 2px;
  background: #EDC594;
  /*background: #8cc413;*/
  display: block;
  position: absolute;
  top: 17.5px;
  right: -90px;  /*これをマイナス値にしてコントロールしたかったがなぜか動作せず断念　右側がきれる、　leftでいれても同じ*/
  z-index: -1;
  overflow: visible;
}

.timeline-mobile li:after{
  content: '';
  width: 60%;
  height: 1px;
  background: #DDD;
  /*background: #8cc413;*/
  display: block;
  position: absolute;
  top: 17.5px;
  right: -30%;  /*これをマイナス値にしてコントロールしたかったがなぜか動作せず断念　右側がきれる、　leftでいれても同じ*/
  z-index: -1;
  overflow: visible;
}

.timeline li.until-active{
  // color: #77eb34;
  // border: #77eb34;
}
.timeline li.until-active:before {
  background: $base-color;
  content: "\F26E";
  font-size: 30px;
  color: white;
  font-family: "bootstrap-icons";
  // color: #2e2eb0;
  border: none;
}

.timeline li.until-active:after{
  background: white;
  // transition:all ease 0.9s;
  // color: #e8e813;
  border: 2px dashed $base-color;
}

.timeline li:last-child:after {
  content: none;
}
.timeline li.active:before{
  // font-size: 20px;
  color: $base-color;
  content: "\F287";
  font-size: 12px;
  text-anchor: start;
  font-family: "bootstrap-icons";
  border: 2px solid $base-color;
}
.timeline li.active {
  // color: red;
  border: $base-color;
}

.timeline li:first-child:before {
 /* color: #8cc413;
  border-color: #8cc413; */
}
.timeline li:first-child:after {
/*  background: #DDD;*/
}

/*div*/
.maru {
  display: inline-block;
  height:20px;
  width:20px;
  border-radius:50%;
  line-height:20px;
  text-align:center;
  vertical-align: middle;
  background-color: blue;
  color:white;
}
/*p*/
.v-center{
  height: 20px;
  line-height: 20px;
  text-align: center;
}

</style>