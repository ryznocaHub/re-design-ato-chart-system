<template>
  <Header msg=""/>

  <h4 class="page-title">ポスティング註文リスト</h4>

  <div class="content-wrapper">
    <div>

      <div :class="device.mobile ? 'search-wrap-mobile' : 'search-wrap'" class="ms-3 me-3">
        <div>
          <div :class="device.mobile ? 'label-mobile' : 'label'">配布ステイタス:</div>
          <select
              id="posting_status_selector"
              :class="device.mobile ? 'label-mobile' : 'label'" class="dropdown"
              >
            <option
                v-for="status in postingStatuses"
                :key="status.id"
                :value="status.id">
              {{ status.name_j }}
            </option>
          </select>
        </div>
        <div>
          <div :class="device.mobile ? 'label-wide-mobile' : 'label-wide'">注文番号:</div>
          <input type="text" id="print_order_id" :class="device.mobile ? 'label-wide-mobile' : 'label-wide'" class="search-input" placeholder="入力 注文番号">
        </div>
        <div>
          <div :class="device.mobile ? 'label-wide-mobile' : 'label-wide'">参照テキスト:</div>
          <input type="text" id="ref_text" :class="device.mobile ? 'label-wide-mobile' : 'label-wide'" class="search-input" placeholder="入力 参照テキスト">
        </div>
        <div>
        <div :class="device.mobile ?  'label-mobile' : 'label'">注文日From</div>
        <input id="from_time" type='date' :class="device.mobile ? 'label-mobile' : 'label'">
        </div>
        <div>
          <div :class="device.mobile ?  'label-mobile' : 'label'">注文日to</div>
          <input id="to_time" type='date' :class="device.mobile ? 'label-mobile' : 'label'">
        </div>
      </div>
    
    </div>
  
    <div class="button-wrap" >
      <button :class="device.mobile ? 'button-mobile' : 'button'" @click="resetCondition()">条件のリセット</button>
      <button :class="device.mobile ? 'button-mobile' : 'button'" @click="searchAgain()">絞り込み</button>
    </div>
  
  
    <div :class="device.mobile ? 'orders-container-mobile' : 'orders-container'" class=" mt-5 ms-3 me-3">
      <!-- only 3 column will appears on mobile view -->
      <div :class="device.mobile ? 'orders-header-mobile' : 'orders-header'">
        <div v-if="!device.mobile" class="header-item">注文日</div>
        <div class="header-item">註文番号</div>
        <div v-if="!device.mobile" class="header-item">ステータス</div>
        <div v-if="!device.mobile" class="header-item">都道府県</div>
        <div v-if="!device.mobile" class="header-item">部数</div>
        <div class="header-item">納品予定日</div>
        <div class="header-item">配布予定日</div>
        <div v-if="!device.mobile" class="header-item">参照テキスト</div>
      </div>
      
      <div v-for="(orderArray,j) in getOrders2d()" :key="j">
        <button class="order-cell" v-for="(order, i) in orderArray" @click="goOrderDetail(order.id)" :key="i">
          <!-- only 3 column will appears on mobile view -->
          <div :class="device.mobile ? 'order-row-mobile' : 'order-row'">
            <div v-if="!device.mobile" class="order-item">{{order.created_at.substr(0,10)}}</div>
            <div class="order-item">{{order.print_order_id}}</div>
            <div v-if="!device.mobile" class="order-item">{{allMenuStore.getters.findPostingStatusJName(order.posting_status)}}</div>
            <div v-if="!device.mobile" class="order-item">{{getPrefectureFromAddress(order.extra.central_name)}}</div>
            <div v-if="!device.mobile" class="order-item">{{order.computed_quantity.toLocaleString()}}</div>
            <div class="order-item">{{order.scheduled_order_date}}</div>
            <div class="order-item">{{order.accepted_posting_date}}</div>
            <div v-if="!device.mobile" class="order-item">{{order.extra.ref_text}}</div>
          </div>
        </button>
      </div>
    </div>
    <button v-if="getOrders2d().length > 0" class="read-more" @click="moreReadOrders()">さらに読み込む</button>
    <button v-if="getOrders2d().length == 0" class="read-more" @click="resetCondition()">註文データがありません。</button>
  </div>

  <Footer v-show="showFooter()" :relative="footerRelative" />
</template>
<script >
import moment from "moment";
import {momentDateFormat} from "@/utils/consts";
import Header from '@/components/Header.vue';
import backendApi from "@/apis/backend-api";
import {orderStore} from "../store/order-store";
import {allMenuStore} from "../store/all-menu-store";
import {postingStatuses} from "../param-options/posting-statuses";
import Footer from "../components/Footer";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//let orders = orderStore.getters.orderArray
let showFooter = false;
let limit = 40
export default {
  name: "Orders",
  components: {
    Header,
    Footer,
  },
  data(){
    return {
      orderStore,
  //    orders,
      allMenuStore,
      postingStatuses,
      device,
    }
  },
  async beforeCreate(){
    //カートにおいて、なぜかparsistenceが効かずこれをいれないと動作しないことがあったため、（demo 環境）
    //念のため入れるが、その分、描画までの体感スピードが落ちる解決し次第、homeのみとする
      const respDataPre = await backendApi.allMenuList()
      allMenuStore.commit("updateAllMenuList",respDataPre.value);
    showFooter = false
//    this.orderStore.commit("updateOrderArray",[])
//    const respData =  await backendApi.refOrderLimit(20)
//    this.orderStore.commit("updateOrderArray",respData.value)
 //  if(! this.orderStore.getters.orderArray2d || this.orderStore.getters.orderArray2d.length == 0 ) {
   //  this.orderStore.commit("updateOrderArray2d", [])
     const respData2d = await backendApi.refOrderLimitGroupBy(limit)
     this.orderStore.commit("updateOrderArray2d", respData2d.value)
   //}

  },
 /* async beforeMount(){




  },*/

  mounted() {

    document.querySelector('body').style.overscrollBehaviorY = 'auto';
    document.querySelector('body').style.overflow = 'auto';
    showFooter = true;
    document.getElementById('posting_status_selector').value = -1;

  },
  methods: {
    resetCondition(){
        document.getElementById('posting_status_selector').value = -1;
        document.getElementById('print_order_id').value = "";
        document.getElementById('ref_text').value = "";
        document.getElementById('from_time').value = "";
        document.getElementById('to_time').value = "";
        this.searchAgain()
    },
    showFooter(){
      return showFooter;
    },
    footerRelative(){
      if(orderStore.getters.orderArray.length < 4){
        false;
      }else{
        true;
      }
    },
    getOrders2d(){
      return orderStore.getters.orderArray2d
    },
    getSpecification(order){
      /*仕様:チラシ・フライヤー A4 両面カラー 光沢紙(コート) 標準：90kg ポスティング(2022/05/17配布完了希望、配布方法：標準配布)部　数:1,682部*/
      // let specification =
      let specification = "用紙サイズ:" +  allMenuStore.getters.findPaperSizeJName(order.paper_size) + " / 配布方法:" + allMenuStore.getters.findMethodsJName(order.method)

      return specification
    },
    async searchAgain(){

      const postingStatus = document.getElementById("posting_status_selector").value;
      const printOrderId  = document.getElementById("print_order_id").value;
      const refText   = document.getElementById("ref_text").value;
      let fromTimeStr = "2020/01/01"
      const fromTime   = document.getElementById("from_time").value;
      if (fromTime){
        fromTimeStr = moment(fromTime).format('YYYY/MM/DD');
      }
      let toTimeStr = "2099/01/01"
      const toTime = document.getElementById("to_time").value;

      if (toTime){
        toTimeStr  = moment(toTime).format('YYYY/MM/DD');
      }
      const respData2d = await backendApi.refOrderLimitGroupBy(limit,Number(postingStatus),printOrderId,refText,fromTimeStr,toTimeStr)
      this.orderStore.commit("updateOrderArray2d", respData2d.value)
    },
    async goOrderDetail(id){
      const resp =  await backendApi.refOrderWithIdAndUserId(id)
      this.orderStore.commit("updateCurrentOrder",resp.value)
      location.href = "/order/" + id
    },
    async moreReadOrders(){
      limit = limit + 20
      this.searchAgain()
    }
    ,getPrefectureFromAddress(address){
      if(address.startsWith("神奈川県")){
        return "神奈川県"
      }else if (address.startsWith("和歌山県")){
        return "和歌山県"
      }else if (address.startsWith("鹿児島県")){
        return "鹿児島県"
      }else{
        return address.substr(0,3);
      }
    }

  }
}
</script>

<style scoped lang="scss">
$base-color: #FF8C00;
$sec-color: #FFE6C7;

 body{
  overflow:auto !important;
}

.content-wrapper{
  padding: 0px 10%;
}

.search-wrap{
  display: flex;
  justify-content: space-between;

  > div {
    width: calc((100% / 5) - 10px) ;
  }
  .label{
  text-align: start;
  padding-left: 10px;
  width: 100%;
  }
  .label-wide{
    @extend .label;
   }
   .search-input {
      background-color: #EBEBEB;
      border-radius: 5px;
      border: 1px solid #EBEBEB;
      padding: 10px 20px;
      &:focus {
        color: $base-color;
        border: 1px solid $base-color;
      }
    }
    input[type=text]{
      margin: 0px;
    }
   .dropdown {
    background-color: #EBEBEB;
    position: relative;
    padding: 13px 20px;
    border-radius: 5px;
    &:focus {
      border: 1px solid $base-color;
    }
   }
   input[type="date"]{
      background-color: #EBEBEB;
      padding: 10px 20px;
      border: none;
      outline: none;
      border-radius: 5px;
    }
    ::-webkit-calendar-picker-indicator{
      padding: 5px;
      border-radius: 3px;
    }
 }

 .search-wrap-mobile{
  @extend .search-wrap;
  flex-direction: column;
  div {
    width: 100% ;
    margin-bottom: 10px;
  }
 }
 .button-wrap{
  display: flex;
  justify-content: end;
  margin: 20px 10px;
  .button{
    background-color: white;
    border: 1px solid $base-color;
    border-radius: 5px;
    padding: 10px 20px;
    color: $base-color;
    font-weight: 900;
    margin-left: 20px;
    &:hover{
      background-color: $sec-color;
    }
  }
  .button-mobile{
    @extend .button;
    font-size: 12px;
    padding: 5px 10px;
  }
 }

.font-bold{
  font-weight: bold;
}

.page-title{
  margin-top: 20px;
  margin-bottom: 40px;
  font-weight: 900;
}

.orders-container {
  .orders-header{
    width: 100%;
    display: flex;
    align-items: start;
    border-bottom: 1px solid #9F9F9F;

    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    .header-item{
      // background-color: red;
      width: calc(100% / 8);
      font-size: 16px;
      text-align: left;
      font-weight: 900;
    }
  }

  .order-cell{
    width: 100%;
    border-bottom: 1px solid #9F9F9F;
    padding: 5px 15px;
    cursor: pointer;
    background-color: white;
    &:hover{
      background-color: $sec-color;
    }
    .order-row {
      display: flex;
      .order-item{
        width: calc(100% / 8);
        text-align: left;
      }
    }
    .order-row-mobile{
      @extend .order-row;
      .order-item{
        width: calc(100% / 3);
      }
    }
  }
}

.orders-container-mobile{
  @extend .orders-container;
  .orders-header-mobile{
      @extend .orders-header;
      font-size: 10px;
      .header-item{
      width: 100px;
    }
  }
}

.read-more{
  background-color: white;
  border: 1px solid $base-color;
  border-radius: 5px;
  padding: 10px 20px;
  color: $base-color;
  font-weight: 900;
  margin: 30px 0px;
  &:hover{
    background-color: $sec-color;
  }
}

</style>