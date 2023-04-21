<template>
  <h2>配布物の発送先の確認</h2>
  <div class="all-cart-wrap">
    <div class="cart-group-wrap" v-for="(orderArray, j) in getOnProcessShippingOrder2dArray()" :key="j">

      <div class="cart-group-wrap-header"  v-if="orderArray[0].data_type == 'posting'">
        <div class="text-id">
          <b  class="text"> 註文GrID:{{orderArray[0].extra.group_id}} 作成:{{orderArray[0].extra.user_name}}</b>
          <div class="plan-created-at">註文日時:{{orderArray[0].created_at}}</div>
        </div>
        <!-- <button v-if="! authorizeStatus(planArray[0])" class="authorized-check-btn" @click="startAuthorizedProcess(planArray[0].extra.group_id,'posting')">:未承認</button>
        <div v-else class="authorized-check-btn">
          <BIconCheckLg class="check-icon"/>
          承認済
        </div> -->
      </div>
      <div class="tes-cart-group-wrap" v-if="orderArray[0].data_type == 'posting'">
        <div  v-for="(order, i) in orderArray" :key="i">
          <details :open="i == 0 && j == 0 ? true: false">

            <summary class="tes-cart-summary" >
              <div class="button">
                <div class="btn">
                  <span class='right-allow h5 icon-circle'><BIconChevronDoubleRight /></span>
                  <span class='down-allow h5 icon-circle'><BIconChevronDoubleDown/></span>
                </div>
              <div :class="device.mobile ? 'text-mobile' : 'cart-container'">
                <b v-html="getSummary(order)"></b>
              </div>
              </div>
              <!-- <div class="menu-icons-container">
                <button class="h5 mr-5 icon-circle" @click="goToMapForEdit(order.order_key,'posting')">
                  <BIconPen/>
                </button>
                <button class="h5 ml-5 icon-circle" @click="removeFromCart(order.order_key,'posting')">
                  <BIconTrash/>
                </button>
              </div> -->
            </summary>

            <div :class="device.mobile ? 'cart-container-mobile' : 'cart-container'">
              <!-- <div class="menu-dummy"></div> -->
              <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
              <!-- <div> -->
                <b class="title">商品概要</b>
                <div class="space"></div>
                <div class="summary-contents" v-html="getSpecification(order)"></div>
              </div>

              <div :class="device.mobile ? 'space' : ''"></div>

              <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
                <b class="title">発送先</b>
                <div class="space"></div>
                <div v-if="!order.sync.synced" class="warning-sync">只今原稿確認プロセス及び、発送先確定作業中です。今しばらくお待ちください。</div>
                <div v-else :id="'destination_detail_' + order.id + '_' + destination.id" class="destination_detail" v-for="(destination,j) in order.destination_obj_array" :key="j">
                  <div class="shipping_address" v-html="getShippingAddress(destination)" ></div>
                  <div class="shipping_address">〒{{destination.zip}} {{destination.address}}</div>
                  <div class="shipping_address">TEL:{{destination.tel}}</div>
                  <div class="shipping_address">発送部数:{{destination.quantity.toLocaleString()}}部</div>
                  <div class="tracking_info">運送会社名およびトラッキング番号を登録ください</div>
                  <div class="tracking_info_register_mobile_label" v-if="device.mobile"><div class="mobile_label">運送会社名:</div><div class="mobile_label">追跡番号:</div></div>
                  <div class="tracking_info_register"><label v-if="! device.mobile" class="label-delivery-company">運送会社:</label><div><input :id="'shipping_company_input_' + order.id + '_' + destination.id"  type="text" :value="destination.shipping_company" /></div> <label v-if="! device.mobile" class="label-tracking-number">追跡番号:</label><div class="tracking-div"><input :id="'first_tracking_input_' + order.id + '_' + destination.id" type="text" :value="firstTrackingNumber(destination.tracking)" /></div> <div class="tracking-plus" > <BIconPlusSquareFill @click="addTrackingInput(order.id,destination.id)"/></div><div class="tracking-check"><BIconCheck2Square @click="updateTrackingInfo(order.id,destination.id,'posting')"/></div> </div>
                  <div class="tracking_info_register_existed"><div :class="device.mobile ? 'hol_apacer-mobile' : 'hol_spacer'"></div><div :id="'tracking_exist_' + order.id + '_' +destination.id" v-html="existTrackingInput(destination.id,destination.tracking)"></div></div>
                  <div class="tracking_info_register_add"><div :class="device.mobile ? 'hol_spacer-mobile' : 'hol_spacer'"></div><div :id="'tracking_add_' + order.id + '_' + destination.id"></div></div>
                </div>
              </div>
            </div>
          </details>
          <div v-if="i != Object.keys(orderArray).length - 1"  class="divider-border"></div>
        </div>
      </div>

      <!-- オリコミのための記述 -->
      <div class="cart-group-wrap-header"  v-if="orderArray[0].data_type == 'orikomi'">
        <div class="text-id">
          <b  class="text"> 註文GrID:{{orderArray[0].extra.group_id}} 作成:{{orderArray[0].extra.user_name}}</b>
          <div class="plan-created-at">註文日時:{{orderArray[0].created_at}}</div>
        </div>
        <!-- <button v-if="! authorizeStatus(planArray[0])" class="authorized-check-btn" @click="startAuthorizedProcess(planArray[0].extra.group_id,'posting')">:未承認</button>
        <div v-else class="authorized-check-btn">
          <BIconCheckLg class="check-icon"/>
          承認済
        </div> -->
      </div>

      
      <div class="tes-cart-group-wrap" v-if="orderArray[0].data_type == 'orikomi'" :open="j == 0 && i == 0 ? true:false"  v-for="(order, i) in orderArray" :key="i">
        <details :open="i == 0 && j == 0 ? true: false">

          <summary class="tes-cart-summary" >
            <div class="button">
              <div class="btn">
                <span class='right-allow h5 icon-circle'><BIconChevronDoubleRight /></span>
                <span class='down-allow h5 icon-circle'><BIconChevronDoubleDown/></span>
              </div>
              <div :class="device.mobile ? 'text-mobile' : 'cart-container'">
                <b v-html="getSummaryOrikomi(order)"></b>
              </div>
            </div>
            <!-- <div class="menu-icons-container">
              <button class="h5 mr-5 icon-circle" @click="goToMapForEdit(order.order_key,'posting')">
                <BIconPen/>
              </button>
              <button class="h5 ml-5 icon-circle" @click="removeFromCart(order.order_key,'posting')">
                <BIconTrash/>
              </button>
            </div> -->
          </summary>

          <div :class="device.mobile ? 'cart-container-mobile' : 'cart-container'">
            <!-- <div class="menu-dummy"></div> -->
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
            <!-- <div> -->
              <b class="title">商品概要</b>
              <div class="space"></div>
              <div class="summary-contents" v-html="getSpecificationOrikomi(order)"></div>
            </div>

            <div :class="device.mobile ? 'space' : ''"></div>

            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
              <b class="title">商品概要</b>
              <div class="space"></div>
              <div v-if="!order.extra.sync.destinations_fixed" class="warning-sync">只今原稿確認プロセス及び、発送先確定作業中です。今しばらくお待ちください。</div>
              <div v-if="order.extra.sync.destinations_fixed" :id="'destination_detail_' + order.order_key + '_' + destination.id" class="destination_detail" v-for="(destination,j) in order.destinations" :key="j">
                <div class="shipping_address" v-html="getShippingAddress(destination)" ></div>
                <div class="shipping_address">〒{{destination.zip}} {{destination.address}}</div>
                <div class="shipping_address">TEL:{{destination.tel}}</div>
                <div class="shipping_address">発送部数:{{destination.quantity.toLocaleString()}}部</div>
                <div class="tracking_info">運送会社名およびトラッキング番号を登録ください</div>
                <div class="tracking_info_register_mobile_label" v-if="device.mobile"><div class="mobile_label">運送会社名:</div><div class="mobile_label">追跡番号:</div></div>
                <div class="tracking_info_register"><label v-if="! device.mobile" class="label-delivery-company">運送会社:</label><div><input :id="'shipping_company_input_' + order.order_key + '_' + destination.id"  type="text" :value="destination.shipping_company" /></div> <label v-if="! device.mobile" class="label-tracking-number">追跡番号:</label><div class="tracking-div"><input :id="'first_tracking_input_' + order.order_key + '_' + destination.id" type="text" :value="firstTrackingNumber(destination.tracking)" /></div> <div class="tracking-plus" > <BIconPlusSquareFill @click="addTrackingInput(order.order_key,destination.id)"/></div><div class="tracking-check"><BIconCheck2Square @click="updateTrackingInfo(order.order_key,destination.id,'orikomi')"/></div> </div>
                <div class="tracking_info_register_existed"><div :class="device.mobile ? 'hol_apacer-mobile' : 'hol_spacer'"></div><div :id="'tracking_exist_' + order.order_key + '_' +destination.id" v-html="existTrackingInput(destination.id,destination.tracking)"></div></div>
                <div class="tracking_info_register_add"><div :class="device.mobile ? 'hol_spacer-mobile' : 'hol_spacer'"></div><div :id="'tracking_add_' + order.order_key + '_' + destination.id"></div></div>
              </div>
            </div>
          </div>
        </details>
        <div v-if="i != Object.keys(orderArray).length - 1"  class="divider-border"></div>
      </div>
        


    </div>
  </div>
</template>

<script>
import {cartStore} from "@/store/cart-store.js";
import {allMenuStore} from "../store/all-menu-store";
import backendApi from "@/apis/backend-api";
// import {BIconCircleFill, BIconPlusSquareFill,BIconCheck2Square, BIconX, BIconXCircleFill, BIconXSquare} from "bootstrap-icons-vue"
import {BIconChevronDoubleDown, BIconChevronDoubleRight, BIconChevronDown,BIconChevronRight,BIconPlusSquareFill, BIconPen, BIconCheck2Square, BIconTrash, BIconCheckLg} from "bootstrap-icons-vue"
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
export default {
  name: "ShippingConfirm",
  data(){
    return {
      cartStore,
     // plan,
      allMenuStore,
      device,
    }
  },
  components: {
    BIconPlusSquareFill,
    BIconCheck2Square,
    BIconChevronDoubleDown,
    BIconChevronDoubleRight,
    BIconChevronDown,
    BIconChevronRight,
    BIconPen,
    BIconTrash,
    BIconCheckLg
  },
  async beforeMount(){
    this.cartStore.commit("updateOnProcessShippingOrder2dArray",[])
    const orderShippingArr = []
    const respData = await backendApi.refOnProcessOrders2dArray("shipping")

    respData.value.forEach(group => {
      orderShippingArr.push(group)
    })

    const respDataOrikomi = await backendApi.refOnProcessOrders2dArrayOrikomi("shipping")
    respDataOrikomi.value.forEach(group => {
      orderShippingArr.push(group)
    })

    orderShippingArr.sort((a,b) => {
      if (a[0].created_at > b[0].created_at){
        return -1
      }else if (a[0].created_at < b[0].created_at){
        return 1
      }else{
        return 0
      }
    })

    this.cartStore.commit("updateOnProcessShippingOrder2dArray",orderShippingArr)
    this.currentStatus = this.cartStore.getters.cartStatus;
  },
  async mounted () {


  },
  beforeUnmount() {
    this.cartStore.commit("updateOnProcessShippingOrder2dArray",[])
  },
  methods:{
    getSummary(plan){
      let preSpecification = ""
      if (plan.extra.posting_area){
        preSpecification = "ポスティング :エリア:" + plan.extra.posting_area + "&nbsp;&nbsp; / 部数:" + plan.computed_quantity.toLocaleString() + ""
      }else{
        preSpecification = "ポスティング :中心部:" + plan.extra.central_name  + "&nbsp;&nbsp; / 部数:" + plan.computed_quantity.toLocaleString() + ""
      }
      if (plan.extra.ref_text  && ! device.mobile){
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
    async updateTrackingInfo(orderId,destinationId,dataType){
        let trackings = [];
        const shippingCompany = document.getElementById("shipping_company_input_" + orderId + "_" + destinationId).value;
        let firstTracking = document.getElementById("first_tracking_input_" + orderId + "_" + destinationId).value;
        const existElementsDiv = document.getElementById("tracking_exist_" + orderId + "_" + destinationId);
        const addElementsDiv = document.getElementById("tracking_add_" + orderId + "_" + destinationId);
        const elements = existElementsDiv.children;
        const addElements = addElementsDiv.children;
        if(firstTracking != ""){
           trackings.push(firstTracking)
        }
        for(let i = 0 ; i < elements.length;i++){
           if(elements[i].tagName == "INPUT"){
             if(elements[i].value != ""){
                trackings.push(elements[i].value)
             }
           }
        }

        for(let i = 0 ; i < addElements.length;i++){
          if(addElements[i].tagName == "INPUT"){
              if(addElements[i].value != ""){
                trackings.push(addElements[i].value)
              }
          }
        }


      let trackingsStr = ""

      for(let i = 0 ; i < trackings.length;i++){
        if (i == 0){
          trackingsStr += trackings[i]
        }else{
          trackingsStr += "," + trackings[i]
        }
      }



     // console.log(shippingCompany)
     // console.log(trackingsStr)
       const respData = await backendApi.updateTrackingInfo(orderId,destinationId,shippingCompany,trackingsStr,dataType)
        console.log(respData)
        console.log(respData.error_message)
        console.log(respData.result)
        console.log(respData.value)
        console.log(respData.description)


    },
    firstTrackingNumber(trackingText){
      if(trackingText == ""){return ""}
      let trackingArray = trackingText.split(',')
      if (trackingArray.length > 0){
        return trackingArray[0]
      }else{
        return "";
      }
    },
    existTrackingInput(destinationId,trackingText){
       if(trackingText == ""){return ""}
       let trackingArray = trackingText.split(',')
       if(trackingArray.length > 1){
         let returnInputs = ""
         for(let i =1;i < trackingArray.length;i++){
           if(i == 1) {
             let test = trackingArray[i]
             returnInputs += "<input type='text' value='" + trackingArray[i] + "' />"
           }else{
             returnInputs += "<br><input type='text' value='" +  trackingArray[i]  + "' />"
           }
         }
         return returnInputs
       }else{
         return ""
       }
    },
    addTrackingInput(orderId,destinationId){
      //追加されたinputを保存することなく、再追加した場合において入力した分が消えてしまう問題への対処 下のfor分二つがその処理となる
      let trackings = []
      const addElementsDiv = document.getElementById("tracking_add_" + orderId + "_" + destinationId);
      const addElements = addElementsDiv.children;
      for(let i = 0 ; i < addElements.length;i++){
        if(addElements[i].tagName == "INPUT"){
          trackings.push(addElements[i].value)
        }
      }
       document.getElementById("tracking_add_" + orderId + "_" + destinationId).innerHTML += "<input class='tracking-number-input' type='text' /><br>";

      const addElementsDivNew = document.getElementById("tracking_add_" + orderId + "_" + destinationId);
      const addElementsNew = addElementsDivNew.children;
      let count = 0
      for(let i = 0 ; i < addElementsNew.length;i++){
        if(addElementsNew[i].tagName == "INPUT"){
          if(count >= trackings.length ){
            break;
          }
          addElementsNew[i].value = trackings[count]
          count++
        }
      }
    },
    getPlans(){
      return cartStore.getters.planArray
    },
    getOnProcessShippingOrderArray(){
      return cartStore.getters.onProcessShippingOrderArray
    },
    getOnProcessShippingOrder2dArray(){
      return cartStore.getters.onProcessShippingOrder2dArray
    },
    getSpecification(plan){
      let specification = "<p><span class='font-bold'>用紙サイズ:</span>" +  allMenuStore.getters.findPaperSizeJName(plan.paper_size) + " / 配布部数:" + plan.computed_quantity.toLocaleString() + "</p>" +
          "<p>配布方法:" +  allMenuStore.getters.findMethodsJName(plan.method) + " / 配布単位: " + allMenuStore.getters.findAreaLevelJName(plan.area_level) + "</p>" +
          "<p>入稿期限日時:" + plan.extra.upload_limit_date  + "</p>" +
          "<p>納品予定日:" + plan.scheduled_order_date +  " / 納品期限日:" + plan.extra.delivery_limit_date + "</p>" +
          "<p>配布完了予定日:" + plan.accepted_posting_date + "</p>"
      return specification
    },
    getSpecificationOrikomi(plan){
      let preSpecification = ""
      preSpecification = "<p className='left'>中心部:&nbsp;" + plan.extra.points[0] + plan.extra.points[1] + plan.extra.points[2] + "</p>"
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
    getShippingAddress(dest){
      let destination = "<div class='destination_name'>" +dest.name  + "</div>"
      return destination
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
    width: calc((100% - 30px) / 2);
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