<template>
  <h2 class="cart-title">カートの内容</h2>
  <!--<div v-if="getPlans().length <= 0" class="cart-empty-container"><p class="empty-explanation">カートに商品が入っていません。地図から見積を検討できます。<a href="javascript:void(0)" @click="goToMap()">見積はここから。</a></p></div> -->
  <div class="tes-cart-group-wrap-out"  v-for="(planArray,j) in getPlans2d()" :key=j >

    <!-- ここはポスティング配布のため
      margin: 0px;の記載 -->
    <div class="cart-group-wrap-header"  v-if="planArray[0].data_type == 'posting'">
      <div>
        <b class="order-group-id"> 註文GrID:{{planArray[0].extra.group_id}} 作成:{{planArray[0].extra.user_name}}</b>
        <div class="plan-created-at">カート投入日時:{{planArray[0].created_at}}</div>
      </div>
      <button v-if="! authorizeStatus(planArray[0])" class="authorized-check-btn" @click="startAuthorizedProcess(planArray[0].extra.group_id,'posting')">:未承認</button>
      <div v-else class="authorized-check-btn">
        <BIconCheckLg class="check-icon"/>
        承認済
      </div>
    </div>

    <div class="tes-cart-group-wrap" v-if="planArray[0].data_type == 'posting'">
      <div  v-for="(plan, i) in planArray" :key="i">
        <details :open="i == 0 && j == 0 ? true: false">
  
          <summary class="tes-cart-summary" >
            <div class="button">
              <div class="btn">
                <span class='right-allow h5 icon-circle'><BIconChevronDoubleRight /></span>
                <span class='down-allow h5 icon-circle'><BIconChevronDoubleDown/></span>
              </div>
              <div :class="device.mobile ? 'text-mobile' : 'cart-container'">
                <b v-html="getSummary(plan)"></b>
              </div>
            </div>
            <div class="menu-icons-container">
              <button class="h5 mr-5 icon-circle" @click="goToMapForEdit(plan.plan_key,'posting')">
                <BIconPen/>
              </button>
              <button class="h5 ml-5 icon-circle" @click="removeFromCart(plan.plan_key,'posting')">
                <BIconTrash/>
              </button>
            </div>
          </summary>
  
          <div :class="device.mobile ? 'cart-container-mobile' : 'cart-container'">
            <!-- <div class="menu-dummy"></div> -->
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
            <!-- <div> -->
              <b class="title">商品概要</b>
              <div class="space"></div>
              <div class="summary-contents" v-html="getSpecification(plan)"></div>
            </div>
  
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
              <template v-if="plan.estimation_obj_array && plan.estimation_obj_array[0].active">
  
                <b class="title">商品価格</b>
                <div class="space"></div>
                <div class="product-row">
                  <div class="left-col">配布単価:</div>
                  <div class="right-col">{{plan.estimation_obj_array[0].unit_price.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">小計:</div><div class="right-col">{{plan.estimation_obj_array[0].sub_total_price.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">消費税:</div><div class="right-col">{{plan.estimation_obj_array[0].tax.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">合計金額:</div><div class="right-col">{{plan.estimation_obj_array[0].total_price.toLocaleString()}}円</div>
                </div>
              </template>
              <template v-if="plan.estimation_obj_array && plan.estimation_obj_array[1].active">
                <div class="title">商品キャンペーン価格</div>
                <div class="space"></div>
                <div class="product-row">
                  <div class="left-col">配布単価:</div><div class="right-col">{{plan.estimation_obj_array[1].unit_price.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">小計:</div><div class="right-col">{{plan.estimation_obj_array[1].sub_total_price.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">消費税:</div><div class="right-col">{{plan.estimation_obj_array[1].tax.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">合計金額:</div>
                  <div class="right-col">{{plan.estimation_obj_array[1].total_price.toLocaleString()}}円</div>
                </div>
              </template>
            </div>
  
            <div :class="device.mobile ? 'cart-content-mobile' :'cart-content'">
  
              <b class="title">配布エリア詳細</b>
              <div class="space"></div>
              <div v-if="plan.area_block_obj_array" class="product-row"  v-for="(area_block, j) in addressListShorthand(plan.area_block_obj_array)" >
                <div class="left-col" :class="area_block.dup == 1 ? 'font-dup' : ''">{{area_block.address}}</div>
                <div class="right-col">{{area_block.quantity.toLocaleString()}}部</div>
              </div>
            </div>
          </div>
        </details>
        <div v-if="i != Object.keys(planArray).length - 1"  class="divider-border"></div>
      </div>
    </div>
    
　　<!--　ここはオリコミのための記載 -->
    <div class="cart-group-wrap-header"  v-if="planArray[0].data_type == 'orikomi'">
      <div>
        <b class="order-group-id"> 註文GrID:{{planArray[0].extra.group_id}} 作成:{{planArray[0].extra.user_name}}</b>
        <div class="plan-created-at">カート投入日時:{{planArray[0].created_at}}</div>
      </div>
      <button v-if="! authorizeStatus(planArray[0])" class="authorized-check-btn" @click="startAuthorizedProcess(planArray[0].extra.group_id,'orikomi')">:未承認</button>
      <div v-else class="authorized-check-btn">
        <BIconCheckLg class="check-icon"/>
        承認済
      </div>
    </div>
    <div class="tes-cart-group-wrap" v-if="planArray[0].data_type == 'orikomi'">
      <div  v-for="(plan, i) in planArray" :key="i">
        <details :open="i == 0 && j == 0 ? true: false">
          <summary class="tes-cart-summary" >
            <div class="button">
              <div class="btn">
                <span class='right-allow h5 icon-circle'><BIconChevronDoubleRight /></span>
                <span class='down-allow h5 icon-circle'><BIconChevronDoubleDown/></span>
              </div>
              <div :class="device.mobile ? 'text-mobile' : 'cart-container'">
                <b v-html="getSummaryOrikomi(plan)"></b>
              </div>
            </div>
            <div class="menu-icons-container">
              <button class="h5 mr-5 icon-circle" @click="goToMapForEdit(plan.plan_key,'orikomi')">
                <BIconPen/>
              </button>
              <button class="h5 ml-5 icon-circle" @click="removeFromCart(plan.plan_key,'orikomi')">
                <BIconTrash/>
              </button>
            </div>
          </summary>
  
          <div :class="device.mobile ? 'cart-container-mobile' : 'cart-container'">
            <!-- <div class="menu-dummy"></div> -->
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
            <!-- <div> -->
              <b class="title">商品概要</b>
              <div class="space"></div>
              <div class="summary-contents" v-html="getSpecificationOrikomi(plan)"></div>
            </div>
  
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
              <template v-if="true">
                <b class="title">商品価格</b>
                <div class="space"></div>
                <div class="product-row">
                  <div class="left-col">配布単価:</div><div class="right-col">{{plan.estimation.unit_price.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">小計:</div><div class="right-col">{{plan.estimation.total_price.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">消費税:</div><div class="right-col">{{plan.estimation.tax.toLocaleString()}}円</div>
                </div>
                <div class="product-row">
                  <div class="left-col">合計金額:</div><div class="right-col">{{plan.estimation.include_tax.toLocaleString()}}円</div>
                </div>
              </template>
            </div>

            <div :class="device.mobile ? 'cart-content-mobile' :'cart-content'">
  
              <b class="title">配布エリア詳細</b>
              <div class="space"></div>
              <div v-for="(item,j) in plan.estimation.items" :key="j">
              <div  v-for="(store, k) in item.sales_stores" :key="k">
                <div  v-if="store.quantity > 0" class="product-row">
                  <div class="left-col" >{{store.store_name}}</div><div class="right-col">{{store.quantity.toLocaleString()}}部</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </details>
        <div v-if="i != Object.keys(planArray).length - 1" class="divider-border"></div>
      </div>

    </div>
  　　<!--　ここはサンプリングのための記載 -->
  </div>

</template>

<script>
import {authStore} from "@/store/auth-store.js"
import {cartStore} from "@/store/cart-store.js";
import {allMenuStore} from "../store/all-menu-store";
import backendApi from "@/apis/backend-api";
import {mapModeStore} from "../store/map-mode-store";
import {BIconChevronDoubleDown, BIconChevronDoubleRight, BIconChevronDown,BIconChevronRight, BIconPen, BIconTrash, BIconCheckLg} from "bootstrap-icons-vue"
import {functionStore} from "../store/function-store";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//let plans = cartStore.getters.planArray

export default {
  name: "CartConfirm"
  ,
  components: {
    BIconChevronDoubleDown,
    BIconChevronDoubleRight,
    BIconChevronDown,
    BIconChevronRight,
    BIconPen,
    BIconTrash,
    BIconCheckLg
},
  data(){
    return {
      cartStore,
     // plans,
      allMenuStore,
      functionStore,
      authStore,
      device,
    }
  },
  methods:{
    authorizeStatus(plan){
      return plan.extra.authorized
    },
    startAuthorizedProcess(groupId,dataType){
      if(this.authStore.getters.authLevel > 1){
        const title = "註文グループの承認"
        const message = "註文GrID：" + groupId  + "に含まれる註文を承認してよろしいですか？"
        if(dataType == "posting"){
          this.genericModalOpenWithArgs(title,message,this.authorizePlans,groupId)
        }else if (dataType == "orikomi"){
          this.genericModalOpenWithArgs(title,message,this.authorizePlansOrikomi,groupId)
        }

      }else{
        const title = "権限ない操作"
        const message = "註文を承認する権限がありません。"
        this.genericAlertOpen(title,message)
      }
    },
    genericAlertOpen(title,message){
      document.getElementById("generic_alert_title").innerText = title;
      document.getElementById("generic_alert_message").innerText = message;
      let modalEle = document.getElementById("generic_alert");
      modalEle.classList.add("active");
    },
    genericModalOpenWithArgs(title,message,execute,args){
      //  modalOkFunction = execute;
      this.functionStore.commit("updateModalOkExecuteWithArgs",execute)
      this.functionStore.commit("updateModalArgs",args)
      document.getElementById("generic_modal_with_args_title").innerText = title;
      document.getElementById("generic_modal_with_args_message").innerText = message;
      let modalEle = document.getElementById("generic_modal_confirm_with_args");
      modalEle.classList.add("active");
    },
    async authorizePlans(groupId){
      const respData = await backendApi.authorizePlans(groupId)
      if(respData.result == "success"){
        for(let i = 0 ; i < cartStore.getters.plan2dArray.length;i++){
          for(let j = 0 ; j < cartStore.getters.plan2dArray[i].length;j++){
            if (cartStore.getters.plan2dArray[i][j].extra.group_id == groupId && cartStore.getters.plan2dArray[i][j].data_type == "posting"){
              cartStore.getters.plan2dArray[i][j].extra.authorized = 1
            }
          }
        }
      }
    },
    async authorizePlansOrikomi(groupId){
      const respData = await backendApi.authorizePlansOrikomi(groupId)
      if(respData.result == "success"){
        for(let i = 0 ; i < cartStore.getters.plan2dArray.length;i++){
          for(let j = 0 ; j < cartStore.getters.plan2dArray[i].length;j++){
            if (cartStore.getters.plan2dArray[i][j].extra.group_id == groupId && cartStore.getters.plan2dArray[i][j].data_type == "orikomi"){
              cartStore.getters.plan2dArray[i][j].extra.authorized = 1
            }
          }
        }
      }
    },
    goToMap(){
      mapModeStore.commit("clearMode");
     // location.href = "/map";
      this.$router.push("/map")
    },
    goToMapForEdit(planKey,dataType){
      if (dataType == "posting"){
        mapModeStore.commit("clearMode");
        mapModeStore.commit("updatePlanKey",planKey);
        this.$router.push("/map")
      }else if (dataType == "orikomi"){
        mapModeStore.commit("clearMode");
        mapModeStore.commit("updatePlanKeyOrikomi",planKey);
        this.$router.push("/orikomi_map")
      }

    },
    async removeFromCart(planKey,dataType){
      const respData = await backendApi.deleteCart(planKey,dataType)
      //指定したplan_keyを持つplanを配列から削除する
      if(respData && respData.result == "success"){
        let breakFlg = false;
        for(let i = 0 ; i < cartStore.getters.plan2dArray.length;i++){


          for(let j = 0; j < cartStore.getters.plan2dArray[i].length;j++){
            if(cartStore.getters.plan2dArray[i][j].plan_key == planKey && cartStore.getters.plan2dArray[i][j].data_type == dataType ){
              cartStore.getters.plan2dArray[i].splice(j,1)
              breakFlg = true;
              break;
            }
          }
          if(breakFlg == true){
            break;
          }
        }

        for(let i = 0 ; i < cartStore.getters.plan2dArray.length;i++){
          if(cartStore.getters.plan2dArray[i].length == 0 ){
            cartStore.getters.plan2dArray.splice(i,1)
          }
        }
      }
    },
    getPlans(){
       return cartStore.getters.planArray
    },
    getPlans2d(){
      return cartStore.getters.plan2dArray
    },
    getSpecification(plan){
      let preSpecification = ""
      if (plan.extra.posting_area){
        preSpecification = "<div class='left-col'>配布エリア:&nbsp;" + plan.extra.posting_area + "</div>"
      }
      let specification = preSpecification + 
        "<div>配布中心部:&nbsp;" + plan.extra.central_name + "</div>" +
        "<div><span class='font-bold'>用紙サイズ:&nbsp;</span>" +  allMenuStore.getters.findPaperSizeJName(plan.paper_size) + " / 配布部数:&nbsp;" + plan.computed_quantity.toLocaleString() + "</div>" +
        "<div>配布方法:&nbsp;" +  allMenuStore.getters.findMethodsJName(plan.method) + " / 配布単位:&nbsp;" + allMenuStore.getters.findAreaLevelJName(plan.area_level) + "</div>" +
        "<div>入稿期限日時:&nbsp;" + plan.extra.upload_limit_date  + "</div>" +
        "<div>納品予定日:&nbsp;" + plan.scheduled_order_date +
        "<div>配布完了予定日:&nbsp;" + plan.accepted_posting_date + "</div>"

      if(plan.extra.ref_text && device.mobile){
        specification = specification + "<div>参照テキスト:&nbsp;" + plan.extra.ref_text + "</div>"
      }
      return specification
    },
    getSpecificationOrikomi(plan){
      let preSpecification = ""
      preSpecification = "<p class='left'>中心部:&nbsp;" + plan.extra.points[0] + plan.extra.points[1] + plan.extra.points[2] + "</p>"
      let blandNames = ""
      for(let i = 0 ; i < plan.estimation.items.length; i++ ){
        if ( i == 0){
          blandNames  = plan.estimation.items[i].brand_name
        }else{
          blandNames  = blandNames + "&nbsp;/&nbsp;" + plan.estimation.items[i].brand_name
        }
      }
      preSpecification = preSpecification + "<p>新聞銘柄:&nbsp;" + blandNames + "</p>" +
          "<p><span class='font-bold'>用紙サイズ:&nbsp;</span>" +  plan.paper_size + "&nbsp;/&nbsp;<span class='font-bold'>厚さ:&nbsp;</span>" + plan.thickness + "</p>" +
          "<p>折込部数:&nbsp;" + plan.estimation.quantity.toLocaleString() + "</p>"
      return preSpecification
    },
    getSummary(plan){
      let preSpecification = ""
      if (plan.extra.identifier){
        preSpecification = "ポスティング配布 :中心部:" + plan.extra.identifier + "&nbsp;&nbsp; / 部数:" + plan.computed_quantity.toLocaleString()
      }else if(plan.extra.posting_area){
        preSpecification = "ポスティング配布 :エリア:" + plan.extra.posting_area + "&nbsp;&nbsp; / 部数:" + plan.computed_quantity.toLocaleString()

      }else{
        preSpecification = "ポスティング配布 :中心部:" + plan.extra.central_name  + "&nbsp;&nbsp; / 部数:" + plan.computed_quantity.toLocaleString()
      }

      if (plan.extra.ref_text && ! device.mobile){
        preSpecification = preSpecification + "&nbsp;&nbsp; / 参照テキスト:" + plan.extra.ref_text
      }
      return preSpecification
    },
    getSummaryOrikomi(plan){
      let preSpecification = "新聞折込 :中心部: " + plan.extra.points[0] + plan.extra.points[1] + plan.extra.points[2] + "&nbsp;&nbsp; / 部数:" + plan.estimation.quantity.toLocaleString()
      if (plan.extra.ref_text && ! device.mobile){
        preSpecification = preSpecification + "&nbsp;&nbsp; / 参照テキスト:" + plan.extra.ref_text
      }
      return preSpecification
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
  }
}
</script>

<style scoped lang="scss">
$base-color: #FF8C00;
$sec-color: #FFE6C7;

  @import '../assets/css/base.css';
  
  .space{
      height: 10px;
    }
  .icon-circle{
    border: 1px solid $base-color;
    background: white;
    margin-left: 10px;
    margin-right: 10px;
    color: $base-color;
    border-radius: 50%;
    padding: 5px;
    &:hover{
      background: $sec-color;
    }
  }
  .divider-border{
    width: 100%;
    border: 0.5px solid #dfdbdb;
    margin-bottom: 5px;
  }

  .tes-cart-group-wrap-out {
    text-align: left;
    padding: 0px;
    margin: 0px;
  }
  .cart-group-wrap-header{
    background: $sec-color;
    border-radius: 10px;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    text-align: start;
    align-items: center;
    
    .authorized-check-btn{
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      color: $base-color;
      font-weight: 900;
      border-radius: 10px;
      border: 1.5px solid $base-color;
      padding: 5px 20px;
      text-align: right;
      white-space: nowrap;
      .check-icon{
        padding: 0px;
        margin-right: 5px;

        font-size: 25px;
        // height: 25px;
        // width: 25px;
      }
    }
  }
  .tes-cart-group-wrap {
    margin-top: 10px;
    margin-bottom: 0px;
    .plan-created-at {
      font-size: 10px;
    }
  }
  .tes-cart-summary{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button{
      display: flex;
      align-items: center;
      .btn {
        width-min: 70px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 0px;
        padding-right: 5px;
      }
      .text {
        font-weight: 900;
        margin-left: 20px;
        width: 50%;
      }
      .text-mobile{
        font-weight: 900;
        margin-left: 20px;
        width: 50%;
        text-align: center;
      }
    }

    .down-allow{
      display: none;
    }
    .right-allow{
      display: inline;
    }
    .menu-icons-container{
      min-width: 10%;
    }
  }
  details[open] {
    .tes-cart-summary {
      .right-allow {
        display: none;

      }
      .down-allow{
        display: inline !important;
      }
    }
  }

  .cart-container{
    margin-left : 30px;
    display:flex;
  }
  .cart-content {
    text-align: left;
    width: calc((100% - 30px) / 3);
    min-height: 200px;
    border: none;
    padding: 20px;
    .title{
      margin-bottom: 100px;
      padding-bottom: 50px;
      font-size: 20px;
    }
  }
  .cart-content-mobile {
    .title{
      font-size: 20px;
    }
  }

  .product-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .left-col {
      text-align: left;
    }
    .right-col {
      text-align: right;
    }
}
</style>