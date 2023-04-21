<template>
  <div class="login-header d-flex align-items-center mb-5">
    <div class="mx-auto font-l">配布自動御見積システム</div>
  </div>
  <div class="container">


    <!-- Email input -->
    <div class="row mb-3">
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      <div :class="device.mobile ? 'col-10' : 'col-4'">
        <label for="exampleInputEmail1" class="form-label text-start w-100 mb-0">ID(EMail)</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="idInput" >
      </div>
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
    </div>

        <!-- Password input -->
    <div class="row mb-2">
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      <div :class="device.mobile ? 'col-10' : 'col-4'">
        <label for="exampleInputPassword1" class="form-label text-start w-100 mb-0">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" v-model="passwordInput" >
      </div>
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
    </div>

    <div class="row mt-0 pt-0">
      <!-- Simple link -->
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      <div class="mt-0 pt-0 text-start"
           :class="device.mobile ? 'col-5' : 'col-2'">
        <button  class="btn btn-primary btn-block font-s" @click="onClickLogin">ログイン</button>
      </div>
      <div class="d-flex align-items-center h-100"
           :class="device.mobile ? 'col-5' : 'col-2'">

      </div>
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
    </div>
    <div class="row mt-5">
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
      <div :class="device.mobile ? 'col-10' : 'col-4'"><div id="login_message" class="text-center"></div></div>
      <div :class="device.mobile ? 'col-1' : 'col-4'"></div>
    </div>

  </div>

</template>

<script>
import {authStore} from "../store/auth-store";
import backendApi from "@/apis/backend-api";
import {cartStore} from "@/store/cart-store.js";
import {orderStore} from "@/store/order-store.js"
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
let result = true
export default {
  name :"Login",
  data(){
    return {
      authStore,
      idInput:"",
      passwordInput:"",
      result,
      cartStore,
      orderStore,
      device,
    }
  },
  mounted(){
     result = true
     this.cartStore.commit("updatePlanArray",[])
    this.orderStore.commit("updateOrderArray",[])
    this.orderStore.commit("updateOnProcessOrderArray",[])
  },
  methods: {
     async onClickLogin(){
       result = true
       console.log(this.idInput)
       console.log(this.passwordInput)
        const respData = await backendApi.tryLogin(this.idInput,this.passwordInput,location.origin,location.origin + "/cart",location.origin +"/map")

   //    console.log(respData.value.name)
     //  console.log(respData.value.department)
       //console.log(respData.value.auth)
       if (respData.result == "success"){
       }else{
         console.log('aa')
       //  $set.result(false,log)
         document.getElementById("login_message").innerText = " IDかパスワードが一致しません。"
         return
       }
       authStore.commit("updateName",respData.value.name)
       authStore.commit("updateDepartment",respData.value.department)
       authStore.commit("updateAuthLevel",respData.value.auth)
       authStore.commit("updateMyAccount",respData.value)
      //  console.log(respData.va)
        console.log(this.authStore.getters.isAuthorized)
        location.href = "/";

     },
     getResult(){
       return result
    }
  }
}

</script>

<style scoped lang="scss">
   #login_message{
     width: 300px;
     z-index: 1000;
   }
   .login-header{
      width: 100%;
      height: 50px;
      background-color: lightgray;
   }


</style>


