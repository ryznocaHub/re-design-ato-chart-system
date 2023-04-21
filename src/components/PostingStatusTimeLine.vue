<template>
  <div class="timeline-block">
    <ul :class="device.mobile ? 'timeline-mobile' : 'timeline'">
      <li :class="[{'active': this.orderStore.getters.currentOrder.posting_status == 0},{'until-active': this.orderStore.getters.currentOrder.posting_status >= 1}]"><span><b class="number">01</b>{{allMenuStore.getters.findPostingStatusJName(0)}}</span></li>
      <li :class="[{'active': this.orderStore.getters.currentOrder.posting_status == 1},{'until-active': this.orderStore.getters.currentOrder.posting_status >= 2}]"><span><b class="number">02</b>{{allMenuStore.getters.findPostingStatusJName(1)}}</span></li>
      <li :class="[{'active': this.orderStore.getters.currentOrder.posting_status == 2},{'until-active': this.orderStore.getters.currentOrder.posting_status >= 3}]"><span><b class="number">03</b>{{allMenuStore.getters.findPostingStatusJName(2)}}</span></li>
      <li :class="[{'active': this.orderStore.getters.currentOrder.posting_status == 3},{'until-active': this.orderStore.getters.currentOrder.posting_status >= 4}]"><span><b class="number">04</b>{{allMenuStore.getters.findPostingStatusJName(3)}}</span></li>
      <li :class="[{'active': this.orderStore.getters.currentOrder.posting_status == 4},{'until-active': this.orderStore.getters.currentOrder.posting_status >= 5}]"><span><b class="number">05</b>{{allMenuStore.getters.findPostingStatusJName(4)}}</span></li>
      <li :class="[{'active': this.orderStore.getters.currentOrder.posting_status == 5},{'until-active': this.orderStore.getters.currentOrder.posting_status >= 6}]"><span><b class="number">06</b>{{allMenuStore.getters.findPostingStatusJName(5)}}</span></li>
    </ul>
  </div>
</template>


<script>
import {cartStore} from "@/store/cart-store.js";
import {orderStore} from "../store/order-store";
import {allMenuStore} from "../store/all-menu-store";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()

export default {
  name: "PostingStatusTimeLine"
  ,
  data(){
    return {
      orderStore,
      allMenuStore,
      device,
    }
  },
  method:{
    cartStatusIsOne(){
      console.log("methodTest")
    }
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
  margin-left: calc((100% - 1200px) * 0.5);
  counter-reset: step;
  overflow: visible;
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
  width: 200px;
  // background: greenyellow;
  // color: $base-color;
  position: relative;
  overflow: visible;
}

.timeline-mobile li{
  float: left;
  text-align: center;
  width: calc(100% / 3);
  position: relative;
  overflow: visible;
  margin-bottom: 20px;
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

.timeline li:after {

  content: '';
  width: 140px;
  height: 2px;
  background: #EDC594;
  /*background: #8cc413;*/
  display: block;
  position: absolute;
  top: 17.5px;
  right: -70px;  /*これをマイナス値にしてコントロールしたかったがなぜか動作せず断念　右側がきれる、　leftでいれても同じ*/
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
.timeline-mobile li:nth-child(3)::after{
  background-color: white;
  border: none;
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