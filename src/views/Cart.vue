<template>
  <Header msg=""/>
  <TimeLine/>
  <div class="container mt-5">

    <CartConfirm v-if="currentStatus() == 1"/>
    <!-- <PaymentConfirm v-if="currentStatus() == 2"/> -->
    <OrderConfirm v-if="currentStatus() == 2"/>
    <!-- <CreditCardUi v-if="currentStatus() == 3"/> -->
    <DataUpload v-if="currentStatus() == 3"/>
    <ShippingConfirm v-if="currentStatus() == 4"/>

    <div class="ui-row">
      <button v-if="currentStatus()==1" :class="device.mobile? 'ui-back-button-mobile': 'ui-back-button'" @click="changeStatus(0)"><span>地図で註文を続ける</span></button>
      <button v-if="currentStatus()==1" :class="device.mobile? 'ui-button-mobile': 'ui-button'" @click="changeStatus(2)" :disabled="isDisabled()"><span>お支払い方法確認へ進む</span></button>
      <button v-if="currentStatus()==2" :class="device.mobile? 'ui-back-button-mobile': 'ui-back-button'" @click="changeStatus(1)"><span>戻る</span></button>
      <button v-if="currentStatus()==2" :class="device.mobile? 'ui-button-mobile': 'ui-button'" @click="onClickOrderConfirm()" :disabled="isDisabled()"><span>次に進む</span></button>
      <button v-if="currentStatus()==3" :class="device.mobile? 'ui-back-button-mobile': 'ui-back-button'" @click="changeStatus(2)"><span>戻る</span></button>
      <button v-if="currentStatus()==3" :class="device.mobile? 'ui-button-mobile': 'ui-button'" @click="changeStatus(4)" :disabled="isDisabled()"><span>注文の確定</span></button>
      <button v-if="currentStatus()==4" :class="device.mobile? 'ui-back-button-mobile': 'ui-back-button'" @click="changeStatus(3)"><span>戻る</span></button>
      <button v-if="currentStatus()==4" :class="device.mobile? 'ui-button-mobile': 'ui-button'" @click="changeStatus(5)"><span>次に進む</span></button>
      <button v-if="currentStatus()==5" :class="device.mobile? 'ui-back-button-mobile': 'ui-back-button'" @click="changeStatus(4)"><span>戻る</span></button>
      <button v-if="currentStatus()==5" :class="device.mobile? 'ui-button-mobile': 'ui-button'" @click="changeStatus(6)"><span>商品詳細画面へ</span></button>
     
    </div>
  </div>
  <DisclaimerDialog :disclaimer-dialog-state-store="disclaimerDialogStateStore"
                    :on-disclaimer-accepted="onDisclaimerAccepted"/>
  <Footer v-show="showFooter()" :relative="footerRelative()"/>
</template>
<script>
import Header from '@/components/Header.vue';
import TimeLine from '@/components/TimeLine.vue';
import CartConfirm from '@/components/CartConfirm.vue';
import PaymentConfirm from '@/components/PaymentConfirm.vue';
import OrderConfirm from '@/components/OrderConfirm.vue';
import DataUpload from '@/components/DataUpload.vue';
import ShippingConfirm from '@/components/ShippingConfirm.vue';
import backendApi from "@/apis/backend-api";
import {allMenuStore} from "@/store/all-menu-store";
import {cartStore} from "@/store/cart-store.js";
import {orderStore} from "@/store/order-store.js"
import {authStore} from "@/store/auth-store";
import Footer from "@/components/Footer";
import {DialogFrameStateStore} from "@/components/dialog-frame-state-store";
import DisclaimerDialog from "@/components/DisclaimerDialog";
import {functionStore} from "@/store/function-store";
import {mapModeStore} from "@/store/map-mode-store";
import { createDeviceDetector } from "next-vue-device-detector";
import {dataTypeKeys, slashedDateFormat} from "@/utils/consts";
import CreditCardUi from '@/components/CreditCardUi.vue';
const device = createDeviceDetector()

//let currentStatus = 1
let showFooter = false
export default {
  name: "Cart",
  components: {
    Header,
    TimeLine,
    CartConfirm,
    PaymentConfirm,
    OrderConfirm,
    DataUpload,
    ShippingConfirm,
    Footer,
    DisclaimerDialog,
    CreditCardUi
},
  data(){
    return {
      authStore,
      cartStore,
      allMenuStore,
      //currentStatus,
      orderStore,
      functionStore,
      disclaimerDialogStateStore: new DialogFrameStateStore(),
      device,
    }
  },
  async beforeCreate(){
    //カートにおいて、なぜかparsistenceが効かずこれをいれないと動作しないことがあったため、（demo 環境）
    //念のため入れるが、その分、描画までの体感スピードが落ちる解決し次第、homeのみとする
    const respDataPre = await backendApi.allMenuList()
    allMenuStore.commit("updateAllMenuList",respDataPre.value);

  },
  async beforeMount(){
    showFooter = false
 //   this.cartStore.commit("updatePlanArray",[])
   // const respData = await backendApi.refCart()
   // this.cartStore.commit("updatePlanArray",respData.value)

    this.cartStore.commit("updatePlan2dArray",[])
    const respDataG = await backendApi.refCartGroupBy()
    console.log(respDataG.value.length)


    const orikomiCartResp = await backendApi.refCartGroupByOrikomi()
    console.log(orikomiCartResp.value.length)
   // console.log(orikomiCartResp)

    const cartArr = []
    respDataG.value.forEach(group => {
    //  group.forEach(order => {
      //  order.data_type = dataTypeKeys.POSTING
      //})
      cartArr.push(group)
    })

    orikomiCartResp.value.forEach(group => {
      //group.data_type = dataTypeKeys.ORIKOMI
      cartArr.push(group)
    })

    cartArr.sort((a,b) => {
      if (a[0].created_at > b[0].created_at){
        return -1
      }else if (a[0].created_at < b[0].created_at){
        return 1
      }else{
         return 0
      }
    })
/*
    cartArr.sort((a, b) => {

      let dateA = a.created_at
      if (!dateA && Array.isArray(a)) {
        for (let i = 0; i < a.length; i++) {
          if (a[i].created_at) {
            dateA = a[i].created_at
            break
          }
        }
      }

      let dateB = b.created_at
      if (!dateB && Array.isArray(b)) {
        for (let i = 0; i < b.length; i++) {
          if (b[i].created_at) {
            dateB = b[i].created_at
            break
          }
        }
      }

      if (!dateA || !dateB) return 0

      dateA = parse(dateA, slashedDateTimeFormatDateFNS, new Date())
      dateB = parse(dateB, slashedDateTimeFormatDateFNS, new Date())

      return isBefore(dateA, dateB) ? 1 : -1
    })*/

    console.log(cartArr)

   this.cartStore.commit("updatePlan2dArray",cartArr)

    //this.cartStore.commit("updatePlan2dArray",cartArr)


    if (! this.$route.query.status){
      this.cartStore.commit("updateCartStatus",1);
    }else if(this.$route.query.status){
      this.cartStore.commit("updateCartStatus",Number(this.$route.query.status));
    }


  },
  async mounted () {


    document.querySelector('body').style.overscrollBehaviorY = 'auto';
    document.querySelector('body').style.overflow = 'auto';

    showFooter = true;
   // showFooter = true;
   // console.log("query-test")
   // console.log(this.$route.query.status)
    //処理中のものを、timelineで幾つあるかを表示するため

    const orderUploadArr = []

    this.cartStore.commit("updateOnProcessUploadOrder2dArray",[])
    const respData2G = await backendApi.refOnProcessOrders2dArray("upload")

    respData2G.value.forEach(group => {
      orderUploadArr.push(group)
    })

    const respData2GOrikomi  = await backendApi.refOnProcessOrders2dArrayOrikomi("upload")

    respData2GOrikomi.value.forEach(group => {

      console.log('respData2GOrikomi -----')

       orderUploadArr.push(group)
    })


    orderUploadArr.sort((a,b) => {
      if (a[0].created_at > b[0].created_at){
        return -1
      }else if (a[0].created_at < b[0].created_at){
        return 1
      }else{
        return 0
      }
    })

    this.cartStore.commit("updateOnProcessUploadOrder2dArray",orderUploadArr)

    const orderShippingArr = []
    this.cartStore.commit("updateOnProcessShippingOrder2dArray",[])
    const respData3G = await backendApi.refOnProcessOrders2dArray("shipping")

    respData3G.value.forEach(group => {

      orderShippingArr.push(group)
    })

    const respData3GOrikomi = await backendApi.refOnProcessOrders2dArrayOrikomi("shipping")

    respData3GOrikomi.value.forEach(group => {

      orderShippingArr.push(group)
    })

    orderShippingArr.sort((a,b) => {
      if (a[0].created_at > b[0].created_at){
        return -1
      }else if (a[0].created_at < b[0].created_at){
        return 0
      }else{
        return 1
      }
    })

    this.cartStore.commit("updateOnProcessShippingOrder2dArray",orderShippingArr)

  },

  beforeUnmount() {
    this.cartStore.commit("updateCartStatus",1);
  },
  methods:{
    currentStatus(){
      return  cartStore.getters.cartStatus
    },
    isDisabled(){
      if(this.currentStatus() < 4 && this.cartStore.getters.cartCount == 0 ){
        console.log("isDisabled true1 ")
        return true;
      }


      if(this.currentStatus() == 3){
        for(let i = 0 ; i < this.cartStore.state.plan2dArray.length;i++){
          if ( this.cartStore.state.plan2dArray[i][0].extra.authorized){
             return false
          }
        }
        return true;
      }
      return false;

      //return this.cartStore.getters.cartCount == 0
    },
    showFooter(){
      return showFooter;
    },
    footerRelative(){
        if (this.cartStore.state.plan2dArray.length > 0){
           return true;
        }else{
          return false;
        }
    },
    async changeStatus(status){
      if(status ==0){
        mapModeStore.commit("clearMode");
       // location.href = "/map"
        this.$router.push("/map")
        return
      }
      if(status ==4){

      }
      if(status == 6){
       // location.href = "/orders"
        this.$router.push("/orders")
        return
      }
      // this.currentStatus = status;
       this.cartStore.commit("updateCartStatus",status);
    },
    async planToOrder(){
      if(this.cartStore.state.plan2dArray && this.cartStore.state.plan2dArray.length > 0){
        const plans = this.cartStore.state.plan2dArray


        for(let i = 0; i < plans.length;i++){
          if (! plans[i][0].extra.authorized){
            continue
          }
          let successPlanKeys = []
          for(let j = 0 ; j < plans[i].length;j++){

            //ここで、data_type によりどちらのorderReceiveを呼ぶかが決められる
            const respData = await backendApi.orderReceive(plans[i][j].plan_key,plans[i][j].data_type)

            //ここには、今は、キーだけをいれているが、data_typeとキーのペアをいれたい
            //alert(respData)
            if (respData.result == "success"){
              successPlanKeys.push(plans[i][j].plan_key)
            }
          }

          for (let j = 0 ; j < successPlanKeys.length; j++){
            const result = this.cartStore.state.plan2dArray[i].filter(function(plan){
              return plan.plan_key !==  successPlanKeys[j]
            });
            this.cartStore.state.plan2dArray[i] = result
          }
        }
      }
    },
    async onDisclaimerAccepted(){
        this.planToOrder()
        this.changeStatus(4)
    },
    onClickOrderConfirm(){
      this.disclaimerDialogStateStore.isVisible = true;
      const  disableScroll = this.functionStore.getters.preventScrollFunction
      document.addEventListener('touchmove', disableScroll, { passive: false });
    }

  }
}
</script>

<style scoped lang="scss">
$main-button-width: 200px;
$main-button-height: 60px;

$main-button-width-mobile: 48%;
$main-button-height-mobile:12vw;

$base-color: #FF8C00;
$sec-color: #FFE6C7;

body{
  overflow-y: scroll !important;
  overflow: scroll !important;
}

.ui-row{
  display: flex;
  position: relative;
  align-items : center;
  width: 100%;
  height: 100px;
  margin-bottom: 60px;
 /* text-align: left;*/
/*  background-color: yellow;*/

  .ui-button {
    display: flex;
    align-items : center;
    position: absolute;
    height: $main-button-height;
    width: $main-button-width;
    background-color: $base-color;
    color: white;
    font-weight: 900;
    // border: 1px solid #777777;
    border-radius: 5px;
    font-size: 14px;
    right: 20px;
    span {
      margin: auto;
    }
    img {
      position: absolute;
      right: 7px;
      top: 7px;
      width: 20px;
      height: 13px;
    }
    &:hover {
       background-color: $sec-color;
       color: $base-color;
       cursor: pointer;
     }
     &:disabled {
      background-color: #FFE6C7;
      cursor: not-allowed;
      &:hover{
        color: white;
      }
    }
  }

  .ui-back-button{
    @extend .ui-button;
    right: 240px;
    background: white;
    border: 1px solid $base-color;
    color: $base-color;
    
  }

  .ui-button-mobile{
    @extend .ui-button;
    height: $main-button-height-mobile;
    width: $main-button-width-mobile;
    right: 0% !important;
  }

  .ui-back-button-mobile{
    @extend .ui-button-mobile;
    right: 52% !important;
  }

}



</style>