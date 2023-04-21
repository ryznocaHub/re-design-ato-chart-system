<template>
  <div class="login-header d-flex align-items-center mb-0 mx-0">
    <div v-if="! device.mobile" class="row mx-auto font-l" @click="onClickHome">アト自動御見積システム</div>
    <div class="logout-div" @click="onClickLogout">ログアウト</div>
    <div class="breadcrumb"><a href="" v-on:click.prevent="onClickHome()">/ホーム</a><p v-html="getBreadcrumb()"></p></div>
    <button class="account-img-div" @click="onClickMyAccount()"><img class="account-img" src="../assets/img/account.png"/></button>
  </div>
</template>

<script>
import {authStore} from "../store/auth-store";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
export default {
  name: "Header",
  props: {
    msg: String
  },
  data(){
    return {
      authStore,
      device,
    }
  },
  methods: {
    onClickLogout(){
      console.log("logout");
      this.authStore.commit("clearToken");
      //location.href = "/login";
      this.$router.push("/login")
    },
    onClickHome(){
     // location.href = "/";
      this.$router.push("/")
    },
    url: function(item) {
      console.log(item)
    },
    getBreadcrumb() {
      if (this.$route.path == "/map") {
        return "&ensp;/マップ"
      }else if (this.$route.path == "/orikomi_map"){
        return "&ensp;/オリコミマップ"
      } else if (this.$route.path == "/") {
        return ""
      } else if (this.$route.path == "/cart") {
        return "&ensp;/カート"
      } else if (this.$route.path == "/orders") {
        return "&ensp;/ポスティング註文リスト"
      } else if (this.$route.path == "/orders_orikomi") {
        return "&ensp;/オリコミ註文リスト"
      } else if (this.$route.path.includes("/order/")) {
        return "&ensp;<a href='/orders'>/ポスティング註文リスト </a>&ensp;/註文詳細"
      } else if (this.$route.path.includes("/order_orikomi/")) {
        return "&ensp;<a href='/orders_orikomi'>/オリコミ註文リスト </a>&ensp;/註文詳細"
      }else if (this.$route.path == "/accounts/manage") {
        return  "&ensp;/アカウントの管理"
      }else if(this.$route.path == "/myAccount"){
        return  "&ensp;/マイアカウント"
      }else{
        return ""
      }

      //orders_orikomi
      //order_orikomi/zSxGm10
    },
    onClickMyAccount(){
      console.log("account_manage");
      location.href = "/myAccount"
    }
  }
}
</script>

<style scoped  lang="scss">
@import '../assets/css/base.css';
.login-header{
  position: relative;
  width: 100%;
  height: 50px;
  background-color: darkorange; //#e98801
  color:white;
  .header-title{
    font-size: 17px;
  }
  .logout-div{
    position: absolute;
    right: 20px;
    top: 10px;
    text-align: right;
  }
  .breadcrumb{
    position: absolute;
    left: 20px;
    top: 10px;
    text-align: left;
  }
  .account-img-div{
    background-color: transparent;
    position: absolute;
    width: 35px;
    height: 35px;
    top: 10px;
    right: 100px;
    .account-img{
      width: 100%;
      height: 100%;
    }
  }
}

</style>