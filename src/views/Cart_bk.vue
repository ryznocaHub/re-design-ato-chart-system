<template>
  <Header msg=""/>
  <div class="container mt-5">
    <p>カート</p>

    <div class="estimation-box shadow-sm rounded-lg">


      <div class="content-frame">
        <div>
          <h5 class="text-center font-weight-bold">お見積り</h5>
        </div>
        <div class="baris-3 d-flex flex-row border-bottom border-dark py-2">
          <div class="w-50 text-left">
            配布部数
          </div>
          <div class="w-50 text-right font-weight-bold">
            部
          </div>
        </div>
        <div>
        <div class="baris-2 d-flex flex-row border-bottom border-dark py-2">
          <div class="w-40 text-left">
            配布完了希望日
          </div>
          <div class="w-60 text-right font-weight-bold">

          </div>
        </div>
        <div class="baris-1 d-flex flex-row border-bottom border-dark py-2">
          <div class="w-40 text-left">
            配布方法
          </div>
          <div class="w-60 text-right font-weight-bold">

          </div>
        </div>
        <div class="baris-4 d-flex flex-row border-bottom border-dark py-2">
          <div class="w-40 text-left">
            印刷 + 配布単価
          </div>
          <div class="w-60 text-right font-weight-bold">
 円
          </div>
        </div>
      </div>
    </div>
      <div class="d-flex flex-row border-bottom border-dark py-2">
        <div class="w-40 text-left">
          小計
        </div>
        <div class="w-60 text-right font-weight-bold">
          円
        </div>
      </div>
      <div class="d-flex flex-row border-bottom border-dark py-2 h-55px">
        <div class="w-40 text-left">
          合計金額<br>（小計 + 税）
        </div>
        <div v-if="false"
             class="w-60 text-right font-weight-bold h4 total-price-cell-normal mt-n1">
          円
        </div>
        <div v-if="true"
             class="w-60 total-price-cell-campaign mt-n2">
          <div class="total-price-before-discount"> 円</div>
          <div class="total-price-discounted">円</div>
        </div>
      </div>
    </div>


    <div class="while-cart" >
       <div v-if="true">カートには商品が入っていません。</div>
       <div class="each-cart my-5 row"  v-for="(plan, index) in cartStore.getters.planArray">
         <div class="col-6">
           <table class="order_table">
             <thead class="order_detail_second_header">
             <tr>
               <td colspan="2" class="td_100 text-bold text-left">配布物情報・予定日データ</td>
             </tr>
             </thead>
             <tbody>
             <tr>
               <td  class="td_20 text-bold text-left">仕様</td>
               <td class="td_30">
                 A4 チラシ/標準配布
               </td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">部数</td><td class="td_30 text-left">1,320</td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">注文予定日</td><td class="td_30 text-left"></td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">配布物到着予定日</td><td class="td_30 text-left"></td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">配布完了予定日</td><td class="td_30 text-left"></td>
             </tr>
             </tbody>
           </table>

         </div>
         <div class="col-6">
           <table class="order_table">
             <thead class="order_detail_second_header">
             <tr>
               <td colspan="2" class="text-bold text-left">配布エリア</td>
             </tr>
             </thead>
             <tbody>
             <tr>
               <td class="w-20 text-bold text-left">配布エリア</td><td class="w-30 text-left">京都府京都市下京区</td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">配布方法</td><td class="td_30 text-left"> 標準配布</td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">エリア区分</td><td class="td_30 text-left">町丁目</td>
             </tr>
             <tr>
               <td class="td_20 text-bold text-left">エリア表</td><td class="td_30 text-right"><button class="btn" onclick="areaListCsv(307 )">ダウンロードする</button></td>
             </tr>
             </tbody>
           </table>
         </div>
         <div clas="w-100 price_block">


         </div>


         <div>{{allMenuStore.getters.findMethodsJName(plan.method)}}</div><div>{{allMenuStore.getters.findPaperSizeJName(plan.paper_size)}}</div>
         <div>{{plan.computed_quantity}}</div><div>{{plan.accepted_posting_date}}</div>
         <div>{{plan.extra.posting_area}}</div>
         <div v-if="onCampaign(plan)">キャンペーン価格</div>
       </div>


    </div>
  </div>
</template>

<script>
import {allMenuStore} from "../store/all-menu-store";
import {cartStore} from "../store/cart-store.js";
import Header from '@/components/Header.vue';
import backendApi from "@/apis/backend-api";
import {authStore} from "../store/auth-store";

export default {
  name: "Cart",
  components: {
    Header
  },
  data(){
    return {
      authStore,
      cartStore,
      allMenuStore,
    }
  },
  async mounted () {
      const respData = await backendApi.planHistory()
      console.log(respData.value)
      console.log(respData.value.length)
      cartStore.commit("updatePlanArray",respData.value)
  },
  methods:{
     onCampaign(plan){
        for(let i =0;i < plan.estimation_obj_array.length;i++){
            if(plan.estimation_obj_array[i].estimation_type === "normal" && plan.estimation_obj_array[i].active){
               return false;
            }
        }
        return true;
     }
  }

}
</script>

<style scoped>

.estimation-box {
  overflow: hidden;
  width: 300px;
  height: auto;

  background-color: white;
//background-color: rgb(200 200 200 / 100%);
//backdrop-filter: blur(5px);
  padding: 1em;
  transition: height 0.5s linear, right 0.5s linear;

.content-frame {
  position: relative;
  top: 0;
  height: auto;
}



&-full-screen {
   right: -300px
 }



.min-max-button {
  position: absolute;
  width: 25px;
  height: 25px;
  top: 10px;
  right: 10px;
  background-repeat: no-repeat;
  background-size: 25px;
  z-index: 10;


&:hover {
   opacity: 0.7;
 }

&:active {
   opacity: 0.3;
 }
}

.w-40 {
  width: 40%;
}

.w-60 {
  width: 60%;
}

.h-55px {
  height: 55px;
}

.border-dark {
  border-color: #ddd !important;
}

.total-price-cell-normal {
  height: 45px;
  line-height: 45px;
}

.total-price-cell-campaign {
  height: 45px;

.total-price-before-discount {
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  margin-top: 2px;
  text-decoration: line-through;
}

.total-price-discounted {
  text-align: right;
  font-size: 22px;
  font-weight: bold;
  color: #DC3545;
  margin-top: -5px;

}
}
}

</style>