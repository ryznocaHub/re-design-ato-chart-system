<template>
    <Header msg=""/>

  <div class="container mt-5">
      <button v-show="getAuthLevel() > 2" :class="device.mobile ? 'add-account-mobile' : 'add-account'" @click="onClickAccountManage()"><img class="add-account-img" src="../assets/img/account_w_plus.png"/></button>
      <div class="row main-portal-row">
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
        <div :class="device.mobile ? 'col-10' : 'col-4'">
          <button class="main-portal-button w-100 h-100" @click="onClickMap">地図から見積を検討</button>
        </div>
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      </div>

    <div class="row main-portal-row">
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      <div :class="device.mobile ? 'col-10' : 'col-4'">
        <button class="main-portal-button w-100 h-100" @click="onClickCart">カート、処理中の注文</button>
      </div>
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
    </div>

      <div class="row main-portal-row">
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
        <div :class="device.mobile ? 'col-10' : 'col-4'">
          <button class="main-portal-button w-100 h-100" @click="onClickOrders">ポスティング　注文の管理</button>
        </div>
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      </div>
      <div class="row main-portal-row">
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
        <div :class="device.mobile ? 'col-10' : 'col-4'">
          <button class="main-portal-button w-100 h-100" @click="onClickOrdersOrikomi">新聞オリコミ　注文の管理</button>
        </div>
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      </div>


      <div class="row main-portal-row">
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
        <div :class="device.mobile ? 'col-10' : 'col-4'">
          <button class="main-portal-button w-100 h-100" @click="onClickOrikomiMap">地図から新聞折込を検討</button>
        </div>
        <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      </div>
       <div class="row main-portal-row"></div>


  </div>
  <Footer/>
</template>

<script>
// @ is an alias to /src
import {allMenuStore} from "../store/all-menu-store";
import Header from '@/components/Header.vue'
import backendApi from "@/apis/backend-api";
import Footer from "../components/Footer";
import {mapModeStore} from "../store/map-mode-store";
import {initFunctionStore} from "../store/function-store";
import {cartStore} from "@/store/cart-store.js";
import {authStore} from "@/store/auth-store.js"
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()


export default {
  name: 'Home',
  components: {
    Header,
    Footer,
  },
  data(){
    return {
      allMenuStore,
      cartStore,
      authStore,
      device,
      //router,
    }
  },
  async beforeCreate(){

   //beforeCreate に allMenuListを置くことによって動作していないように感じる mountedに移動してテスト
  },
  async mounted(){
    initFunctionStore()
    const respData = await backendApi.allMenuList()
    allMenuStore.commit("updateAllMenuList",respData.value);
  },
  methods:{
    async onClickMap(){
     const respData = await backendApi.verifyToken()
      if(respData.result == "success"){
       // location.href = "/map";
       // this.router.push('/map')
        mapModeStore.commit("clearMode");
        this.$router.push("/map")
      }
    },
    async onClickOrikomiMap(){
      const respData = await backendApi.verifyToken()
      if(respData.result == "success"){
        // location.href = "/map";
        // this.router.push('/map')
     //   mapModeStore.commit("clearMode");
        this.$router.push("/orikomi_map")
      }
    },
    onClickCart(){
      console.log("cart");
      this.cartStore.commit("updateCartStatus",1);
      this.$router.push("/cart")
    },
    onClickOrders(){
      console.log("orders");
    //  location.href = "/orders"
      this.$router.push("/orders")
    },
    onClickOrdersOrikomi(){
      console.log("orders_orikomi");
      //  location.href = "/orders"
      this.$router.push("/orders_orikomi")
    },
    onClickAccountManage(){
      console.log("account_manage");
     // location.href = "/accounts/manage"
      this.$router.push("/accounts/manage")
    },
    getAuthLevel(){
      return this.authStore.getters.authLevel
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .add-account{
    position: absolute;
    top: 0px;
    right: 0px;
    width: 65px;
    height: 65px;
    background-color: darkorange;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0;
    .add-account-img{
      background-color: transparent;
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }
  .add-account-mobile{
    position: absolute;
    bottom: 15vw;
    right: 0px;
    width: 65px;
    height: 65px;
    background-color: darkorange;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0;
    .add-account-img{
      background-color: transparent;
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }
  .main-portal-row {
    height: 100px;
    margin-bottom: 30px;
    .main-portal-button {
      width: 100%;
      height: 100%;
      background-color: white;
      color: black;
      border: 2px solid darkorange;
      border-radius: 7px;
      font-size: 20px;
    }
  }
}

</style>
