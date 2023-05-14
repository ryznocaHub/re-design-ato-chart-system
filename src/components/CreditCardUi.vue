<template>
  <div class="body-container">
    <img class="img-hero" alt="image modal" src="../assets/img/card_ui.png" />
    <div class="header-button">お支払い方法の選択</div>
    <div class="flex-container">
      <button class="flex-button" :class="[radioButton == 'credit_card' ? 'active' : null ]" @click="() => radioButton = 'credit_card'">
        <img src="../assets/img/creditCard.png" class="img-button">
        <label >クレジットカード</label>
      </button>
      <button class="flex-button" :class="[radioButton == 'invoice' ? 'active' : null ]" @click="() => radioButton = 'invoice'">
        <img src="../assets/img/invoice.png" class="img-button">
        <label >インボイス</label>
      </button>
    </div>
    <div class="header">クレジットカード</div>
    <div>ディテールペサナン</div>
    
    <div  v-for="(planArray,i) in getPlans2d()" :key=i>

      <template v-for="(plan,j) in planArray" :key=j >
        <div class="space"></div>
        <div class="content-container" >
          <!-- posting map -->
          <template v-if="planArray[0].data_type == 'posting'">
            <div class="item-container">
              <div class="item-header">商品概要</div>
              <div>配布エリア: {{plan.extra.posting_area}}</div>
              <div>配布中心部: {{plan.extra.central_name}}</div>
              <div>用紙サイズ: {{ allMenuStore.getters.findPaperSizeJName(plan.paper_size) }} / 配布部数: {{plan.computed_quantity}}</div>
              <div>配布方法: {{allMenuStore.getters.findMethodsJName(plan.method)}} / 配布単位: {{allMenuStore.getters.findAreaLevelJName(plan.area_level)}}</div>
              <div>入稿期限日時: {{ plan.extra.upload_limit_date }}</div>
              <div>納品予定日: {{ plan.scheduled_order_date }}</div>
              <div>配布完了予定日: {{ plan.accepted_posting_date }}</div>
            </div>
            <div class="item-container" v-if="plan.estimation_obj_array && plan.estimation_obj_array[0].active">
              
              <div class="item-header">商品概要</div>
              <div class="text-container">
                <div>配布単価:</div>
                <div>{{ plan.estimation_obj_array[0].unit_price }}円</div>
              </div>
              <div class="text-container">
                <div>小計:</div>
                <div>{{plan.estimation_obj_array[0].sub_total_price}}円</div>
                <!-- <div>{{plan.estimation_obj_array[0].tax.toLocaleString()}}円<div> -->
              </div>
              <div class="text-container">
                <div>消費税:</div>
                <div>{{plan.estimation_obj_array[0].tax}}円</div>
              </div>
              <div class="text-container">
                <div>合計金額:</div>
                <div>{{plan.estimation_obj_array[0].total_price}}円</div>
              </div>
            </div>
            <div class="item-container" v-if="plan.estimation_obj_array && plan.estimation_obj_array[1].active">
              <div class="item-header">商品キャンペーン価格</div>
              <div class="text-container">
                <div>配布単価:</div>
                <div>{{plan.estimation_obj_array[1].unit_price}}円</div>
              </div>
              <div class="text-container">
                <div>小計:</div>
                <div>{{plan.estimation_obj_array[1].sub_total_price}}円</div>
              </div>
              <div class="text-container">
                <div>消費税:</div>
                <div>{{plan.estimation_obj_array[1].tax}}円</div>
              </div>
              <div class="text-container">
                <div>合計金額:</div>
                <div>{{plan.estimation_obj_array[1].total_price}}円</div>
              </div>
            </div>
            <div class="item-container" v-if="plan.area_block_obj_array">
              <div class="item-header">配布エリア詳細</div>
              <div  class="text-container"  v-for="(area_block, idx) in addressListShorthand(plan.area_block_obj_array)" :key="idx" >
                <div >{{area_block.address}}</div>
                <div >{{area_block.quantity}}部</div>
              </div>
            </div>
          </template>

          <!-- orikomi -->
          <template v-if="planArray[0].data_type == 'orikomi'">
            <div class="item-container">
              <div class="item-header">商品概要</div>
              <div>中心部: {{plan.extra.points[0] + plan.extra.points[1] + plan.extra.points[2]}}</div>
              <div>
                新聞銘柄: 
                <span v-for="(plan,idx) in plan.estimation.items" :key="idx" >
                  <span v-if="idx != 0"> / </span>
                  {{ plan.brand_name }} 
                </span>
              </div>
              <div>用紙サイズ: {{ plan.paper_size }} / 配布部数: {{plan.computed_quantity}}</div>
              <div>配布方法: {{allMenuStore.getters.findMethodsJName(plan.method)}} / 厚さ: {{plan.thickness}}</div>
              <div>折込部数: {{ plan.estimation.quantity }}</div>
            </div>

            <div class="item-container">
              <div class="item-header">商品価格</div>
              <div class="text-container">
                <div>配布単価:</div>
                <div>{{plan.estimation.unit_price}}円</div>
              </div>
              <div class="text-container">
                <div>小計:</div>
                <div>{{plan.estimation.total_price}}円</div>
              </div>
              <div class="text-container">
                <div>消費税:</div>
                <div>{{plan.estimation.tax}}円</div>
              </div>
              <div class="text-container">
                <div>合計金額:</div>
                <div>{{plan.estimation.include_tax}}円</div>
              </div>
            </div>
            
            <div class="item-container">
              <div class="item-header">配布エリア詳細</div>
              <div v-for="(item,m) in plan.estimation.items" :key="m">
                <div  v-for="(store, n) in item.sales_stores" :key="n">
                  <div  v-if="store.quantity > 0" class="text-container">
                    <div>{{store.store_name}}</div>
                    <div>{{store.quantity.toLocaleString()}}部</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
  
        </div>
      </template>

    </div>

    <div class="footer">
      <div class="title">メモ:</div>
      <div>お支払いの前に、お客様の情報が正しいかどうかご確認ください。</div>
      <div v-if="radioButton == 'credit_card'">
        <div v-if="!isRegistered">
          <div>クレジットカードの登録がまだのようですが、こちらから登録してください。</div>
          <button class="button-register" @click="isRegistered = true">ここに登録</button>
        </div>
        <button class="button-footer" :disabled="!isRegistered">決済を行う</button>
      </div>
      <div v-if="radioButton == 'invoice'">
        <div class="footer-bold">請求書のダウンロードはこちら</div>
        <button class="button-footer">ダウンロード</button>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from "@/store/auth-store.js";
import { cartStore } from "@/store/cart-store.js";
import { allMenuStore } from "../store/all-menu-store";
import backendApi from "@/apis/backend-api";
import { mapModeStore } from "../store/map-mode-store";
import {
  BIconChevronDoubleDown,
  BIconChevronDoubleRight,
  BIconChevronDown,
  BIconChevronRight,
  BIconPen,
  BIconTrash,
  BIconCheckLg,
} from "bootstrap-icons-vue";
import { functionStore } from "../store/function-store";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector();
//const plans = cartStore.getters.planArray
export default {
  name: "CreditCardUi",
  components: {
    BIconChevronDoubleDown,
    BIconChevronDoubleRight,
    BIconChevronDown,
    BIconChevronRight,
    BIconPen,
    BIconTrash,
    BIconCheckLg,
  },
  data() {
    return {
      cartStore,
      // plans,
      allMenuStore,
      functionStore,
      authStore,
      device,
      isRegistered : false,
      radioButton : 'credit_card'
    };
  },
  methods: {
    getUnitPrice(plan) {
      return plan.estimation_obj_array[0].unit_price
    },
    getPlans2d() {
      return cartStore.getters.plan2dArray;
    },
    addressListShorthand(areaBlocks){
       let simpleAreaBlocks = []
       let beforeAddress = ""
       let culc = 0;
       let dupCulc = 0;
       for(let i = 0 ; i < areaBlocks.length; i++){
           areaBlocks[i].address = areaBlocks[i].address.split("(")[0]

           if (beforeAddress == areaBlocks[i].address){
             beforeAddress = areaBlocks[i].address
             culc = culc + Number(areaBlocks[i - 1].quantity)
             if(areaBlocks[i].dup == 1){
               dupCulc = dupCulc + Number(areaBlocks[i - 1].quantity)
             }
             //areaBlocks[i].quantity = Number(areaBlocks[i].quantity) + Number(areaBlocks[i - 1].quantity)
           }else{
             beforeAddress = areaBlocks[i].address
             if(i != 0){
                let newObj =  JSON.parse(JSON.stringify( areaBlocks[i - 1]))
              //  areaBlocks[i - 1].quantity = culc + Number(areaBlocks[i - 1].quantity)
                newObj.quantity = culc + Number(newObj.quantity)
                newObj.dup_quantity = dupCulc + Number(newObj.quantity)
               culc = 0
               dupCulc = 0
                simpleAreaBlocks.push(newObj)
              // continue
             }
           }

           if(i == areaBlocks.length - 1){
              let newObj = JSON.parse(JSON.stringify(areaBlocks[i]))
             newObj.quantity = culc + Number(newObj.quantity)
             newObj.dup_quantity = dupCulc + Number(newObj.quantity)
             culc = 0
             dupCulc = 0
             simpleAreaBlocks.push(newObj)
           }

       }
       return simpleAreaBlocks
     }
  },
};
</script>

<style scoped lang="scss">
$base-color: #ff8c00;
$sec-color: #ffe6c7;
$border-radius: 8px;
.body-container {
  text-align: start;
}
.img-hero {
  width: 100%;
  margin-bottom: 40px;
}

.header-button{
  font-weight: 700;
  margin-bottom: 10px;
  margin-left: 10px;
}
.flex-container {
  display: flex;
}
.flex-button {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #9f9f9f;
  padding: 10px 10px;
  margin-right: 30px;
  border-radius: $border-radius;
  label {
    font-size: 14px;
    font-weight: 600;
    margin-left: 5px;
  }
  .img-button {
    width: 20px;
    margin: 0px 5px;
  }
  .form-control:focus-within {
    color: var(--form-control-color);
  }

  input[type="radio"] {
    // accent-color: $base-color;
    // border: 1px solid $base-color
  }
}
.active {
  @extend .flex-button;
  border: 2px solid $base-color;
}
.header {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 900;
  text-decoration: underline;
  text-decoration-color: $base-color;
  text-decoration-thickness: 3px;
  text-underline-offset: 5px;
  padding-bottom: 5px;
}
.cart-container {
  display: flex;
}
.content-container {
  margin-top: 20px;
  display: flex;
  .item-container {
    width: calc((100% - 30px) / 3);
    margin-left: 30px;
    background-color: red9;
    .text-container {
      display: flex;
      justify-content: space-between;
    }
    .item-header{
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 10px;
    }
  }
}

.space {
  margin: 20px 0px;
  border-bottom: 1px solid #9f9f9f;
}

.footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #9f9f9f;
  color: #CD0000;
  .title {
    font-size: 16px;
    font-weight: 800;
  }
  .footer-bold{
    margin-top: 20px;
    color: black;
    font-weight: 800;
  }
}
.button-footer{
  background-color: $base-color;
  padding: 5px 100px;
  color: white;
  font-weight: 900;
  // border: 1px solid #777777;
  border-radius: 5px;
  font-size: 14px;
  right: 20px;
  margin-top: 20px;
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
.button-register{
    @extend .button-footer;
    padding: 10px 20px;

    background: white;
    border: 1px solid $base-color;
    color: $base-color;
  }
</style>
