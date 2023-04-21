<template>
  <h2>配布物確認</h2>
  <div class="all-cart-wrap">
    <div class="cart-group-wrap-out" v-for="(orderArray, j) in getOnProcessUploadOrder2dArray()" :key="j">
      
      <div class="cart-group-wrap-header"  v-if="orderArray[0].data_type == 'posting'">
        <div class="text-id">
          <b  class="text"> 註文GrID:{{orderArray[0].extra.group_id}} 作成:{{orderArray[0].extra.user_name}}</b>
          <div class="plan-created-at">カート投入日時:{{orderArray[0].created_at}}</div>
        </div>
        <!-- <button v-if="! authorizeStatus(orderArray[0])" class="authorized-check-btn" @click="startAuthorizedProcess(orderArray[0].extra.group_id,'posting')">:未承認</button>
        <div v-else class="authorized-check-btn">
          <BIconCheckLg class="check-icon"/>
          承認済
        </div> -->
      </div>
      <!-- ポスティング配布のための記述 -->
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
          </summary>

          <div :class="device.mobile ? 'cart-container-mobile' : 'cart-container'">
            <!-- <div class="menu-dummy"></div> -->
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
            <!-- <div> -->
              <b class="title">アップロード期限日時</b>
              <div class="space"></div>
              <p>{{order.extra.upload_limit_date.substr(0,16)}}</p>
              <p>アップロード日時までに入稿いただけない場合、配布完了予定日時が遅れる場合があります。</p>
            </div>

          
            <div :class="device.mobile ? 'tes-payment-method-mobile' : 'tes-payment-method'">
              <b class="product-title font-size20">データ選択</b>
              <div :id="'file-upload-spinner_' + order.print_order_id" class="first-spinner theme-text-color"></div>
                <p class="explain-upload">データを選択してください。<br>複数ファイルに分かれている場合は、zipとして纏めて一つのファイルとしてアップロードください。</p>
                <div class="upload-div">
                  <form>
                    <input type="file" id="file1"
                          @change="uploadMediaData(order.id,order.print_order_id)">
                  </form>
                </div>
                <p :id="'msg_' + order.print_order_id" class="message-for-upload visually-hidden">✔アップロードが完了しました。修正したい場合は再度アップロードください。</p>
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
          <div class="plan-created-at">カート投入日時:{{orderArray[0].created_at}}</div>
        </div>
        <!-- <button v-if="! authorizeStatus(orderArray[0])" class="authorized-check-btn" @click="startAuthorizedProcess(orderArray[0].extra.group_id,'posting')">:未承認</button>
        <div v-else class="authorized-check-btn">
          <BIconCheckLg class="check-icon"/>
          承認済
        </div> -->
      </div>

      <div class="tes-cart-group-wrap"   v-if="orderArray[0].data_type == 'orikomi'">
      <div  v-for="(order, i) in orderArray" :key="i">
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
              <button class="h5 mr-5 icon-circle" @click="goToMapForEdit(order.plan_key,'orikomi')">
                <BIconPen/>
              </button>
              <button class="h5 ml-5 icon-circle" @click="removeFromCart(order.plan_key,'orikomi')">
                <BIconTrash/>
              </button>
            </div> -->
          </summary>
          <div :class="device.mobile ? 'cart-container-mobile' : 'cart-container'" >
            <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'">
            <!-- <div> -->
              <b class="title">アップロード期限日時</b>
              <div class="space"></div>
              <p>{{order.extra.upload_limit_date.substr(0,16)}}</p>
              <p>アップロード日時までに入稿いただけない場合、配布完了予定日時が遅れる場合があります。</p>
            </div>

            <div :class="device.mobile ? 'tes-payment-method-mobile' : 'tes-payment-method'">

            <!-- <div :class="device.mobile ? 'cart-content-mobile' : 'cart-content'"> -->

              <b class="product-title font-size20">データ選択</b>
              <div class="space"></div>
              <div :id="'file-upload-spinner_' + order.order_key" class="first-spinner theme-text-color"></div>
                <p class="explain-upload">データを選択してください。<br>複数ファイルに分かれている場合は、zipとして纏めて一つのファイルとしてアップロードください。</p>
                <div class="upload-div">
                  <form>
                    <input type="file" id="file1"
                          @change="uploadMediaDataOrikomi(order.order_key)">
                  </form>
                </div>
                <p :id="'msg_' + order.order_key" class="message-for-upload visually-hidden">✔アップロードが完了しました。修正したい場合は再度アップロードください。</p>
            </div>
          </div>
        </details>
      <div v-if="i != Object.keys(orderArray).length - 1" class="divider-border"></div>
    </div>

    </div>

    </div>
  </div>
</template>

<script>
import {cartStore} from "@/store/cart-store.js";
import {allMenuStore} from "../store/all-menu-store";
import {baseDomain, orikomiDomain} from "../utils/baseConsts";
import {authStore} from "../store/auth-store";
import backendApi from "@/apis/backend-api";
import {BIconChevronDoubleDown, BIconChevronDoubleRight, BIconChevronDown,BIconChevronRight} from "bootstrap-icons-vue"
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//const plans = cartStore.getters.planArray
export default {
  name: "DataUpload.vue",
  components: {
    BIconChevronDoubleDown,
    BIconChevronDoubleRight,
    BIconChevronDown,
    BIconChevronRight,
  },
  data(){
    return {
      cartStore,
      authStore,
      allMenuStore,
      device,
    }
  },
  async beforeMount(){
    console.log("In Cart")
    this.cartStore.commit("updateOnProcessUploadOrder2dArray",[])
    const orderUploadArr = []
    const respData = await backendApi.refOnProcessOrders2dArray("upload")

    respData.value.forEach(group => {
      orderUploadArr.push(group)
    })

    const respDataOrikomi  = await backendApi.refOnProcessOrders2dArrayOrikomi("upload")

    respDataOrikomi.value.forEach(group => {

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
    this.currentStatus = this.cartStore.getters.cartStatus;
  },
  async mounted () {


  },
  beforeUnmount(){
    this.cartStore.commit("updateOnProcessUploadOrder2dArray",[])
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

    getPlans(){
      return cartStore.getters.planArray
    },
    getOnProcessUploadOrderArray(){
      return cartStore.getters.onProcessUploadOrderArray
    },
    getOnProcessUploadOrder2dArray(){
      return cartStore.getters.onProcessUploadOrder2dArray
    },


    async uploadMediaDataOrikomi(orderKey){
      // let co = this.co()
      if(!  document.getElementById("file1").value ){
        console.log('No file is selected.');
        return
      }
      console.log("a")
      // let sock = new WebSocket("wss://"+ backendApi.backendWebSocketDomain);

      document.getElementById("file-upload-spinner_" + orderKey).classList.add("spinner-border")

      let sock = new WebSocket("wss://"  + orikomiDomain + ":9011");
      let file =  document.getElementById("file1").files[0];
      console.log("bb")
      sock.onmessage = function(event) {

        let data = JSON.parse(event.data);

        console.log(data.err)
        console.log(data.process_ratio)
        console.log(data.mile_stone)
        console.log(data.desc)
        console.log(data.result)

        if (data.mile_stone == "fin" && data.result == "success"){
          //document.getElementById("file_name").innerText = file.name;
          if(document.getElementById("msg_" + orderKey ).classList.contains("visually-hidden")){
            document.getElementById("msg_" + orderKey ).classList.remove("visually-hidden");
          }
        }




        if (data.mile_stone == "next_to_process"){
          parseFile(file,function(result,offset,size){
            console.log(offset)
            console.log(size)
            sock.send(result);
          });
        }
      },
          sock.onclose = function(event){
            sock.close()
            document.getElementById("file-upload-spinner_" + orderKey).classList.remove("spinner-border");

          },
          sock.onopen = function(event){
            console.log("cc")

            let sendDataPre = {
              token:authStore.getters.rawToken,
              order_key: orderKey,
              file_name: file.name,
              file_size:file.size,
              file_type: file.type,
            };
            console.log("d")
            let sendJsonPre = JSON.stringify(sendDataPre);
            sock.send(sendJsonPre);

          }
      console.log("e")
      function parseFile(file, callback) {
        console.log("f")
        let fileSize = file.size;
        let chunkSize = 256 * 1024;// bytes
        // let chunkSize = 2048 * 2048;//
        let offset = 0;
        // let self = this; // we need a reference to the current object
        let block = null;

        let foo = function(evt) {
          if (evt.target.error == null) {
            offset += chunkSize;
            //offset += evt.target.result.length;
            callback(evt.target.result,offset,evt.target.result.length); // callback for handling read chunk
          } else {
            console.log("Read error: " + evt.target.error);
            return;
          }
          if (offset >= fileSize) {
            console.log("Done reading file");
            callback('',offset,0);//最後に空を送る

            return;
          }

          block(offset, chunkSize, file);
        }

        block = function(_offset, length, _file) {
          let r = new FileReader();
          let blob = _file.slice(_offset, length + _offset);
          r.onload = foo;
          //  r.readAsText(blob);
          //r.readAsBinaryString(blob)

          r.readAsArrayBuffer(blob)
          //r.readAsBinaryString(blob)

        }
        block(offset, chunkSize, file);
      }

    },
    async uploadMediaData(id,print_order_id){

     // let co = this.co()
      if(!  document.getElementById("file1").value ){
        console.log('No file is selected.');
        return
      }
      console.log("a")
      // let sock = new WebSocket("wss://"+ backendApi.backendWebSocketDomain);

      document.getElementById("file-upload-spinner_" + print_order_id).classList.add("spinner-border")

      let sock = new WebSocket("wss://"  + baseDomain + ":8401");
      let file =  document.getElementById("file1").files[0];
      console.log("bb")
      sock.onmessage = function(event) {

        let data = JSON.parse(event.data);

        console.log(data.err)
        console.log(data.process_ratio)
        console.log(data.mile_stone)
        console.log(data.desc)
        console.log(data.result)

        if (data.mile_stone == "fin" && data.result == "success"){
          //document.getElementById("file_name").innerText = file.name;
          if(document.getElementById("msg_" + print_order_id ).classList.contains("visually-hidden")){
            document.getElementById("msg_" + print_order_id ).classList.remove("visually-hidden");
          }
        }




        if (data.mile_stone == "next_to_process"){
          parseFile(file,function(result,offset,size){
            console.log(offset)
            console.log(size)
            sock.send(result);
          });
        }
      },
          sock.onclose = function(event){
            sock.close()
            document.getElementById("file-upload-spinner_" + print_order_id).classList.remove("spinner-border");

          },
          sock.onopen = function(event){
            console.log("cc")

            let sendDataPre = {
              token:authStore.getters.rawToken,
              id : Number(id),
              print_order_id: print_order_id,
              file_name: file.name,
              file_size:file.size,
              file_type: file.type,
            };
            console.log("d")
            let sendJsonPre = JSON.stringify(sendDataPre);
            sock.send(sendJsonPre);

          }
      console.log("e")
      function parseFile(file, callback) {
        console.log("f")
        let fileSize = file.size;
        let chunkSize = 256 * 1024;// bytes
        // let chunkSize = 2048 * 2048;//
        let offset = 0;
        // let self = this; // we need a reference to the current object
        let block = null;

        let foo = function(evt) {
          if (evt.target.error == null) {
            offset += chunkSize;
            //offset += evt.target.result.length;
            callback(evt.target.result,offset,evt.target.result.length); // callback for handling read chunk
          } else {
            console.log("Read error: " + evt.target.error);
            return;
          }
          if (offset >= fileSize) {
            console.log("Done reading file");
            callback('',offset,0);//最後に空を送る

            return;
          }

          block(offset, chunkSize, file);
        }

        block = function(_offset, length, _file) {
          let r = new FileReader();
          let blob = _file.slice(_offset, length + _offset);
          r.onload = foo;
          //  r.readAsText(blob);
          //r.readAsBinaryString(blob)

          r.readAsArrayBuffer(blob)
          //r.readAsBinaryString(blob)

        }
        block(offset, chunkSize, file);
      }

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
  .text-id{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    .text{
      font-weight: 900;
    }
    // text-align: left !important;
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
    text-align: start;
    justify-content: space-between;
    align-items: center;
    
    .authorized-check-btn{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      color: $base-color;
      font-weight: 900;
      border-radius: 10px;
      border: 1.5px solid $base-color;
      padding: 5px 20px;
      white-space: nowrap;
      text-align: right;
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
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 0px;
        padding-right: 0px;
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
  .tes-payment-method {
    pointer-events: fill;
    position: relative;
    text-align: left;
    width: calc((100% - 30px) / 2);
    min-height: 200px;
    border: none;
    border-left: none;
    padding: 20px;
    .title{
      margin-bottom: 100px;
      padding-bottom: 50px;
      font-size: 20px;
    }
    .space{
      height: 10px;
    }
    .explain-upload{
      position: absolute;
      top: 60px;
      left: 20px;
    }
    .first-spinner{
      position: absolute;
      top: 130px;
      left: 5px;
    }
    .upload-div {
      position: absolute;
      top: 130px;
      left: 40px;

      input[type=file]::file-selector-button {
        height: 30px;
        widhth: 100px;
        border: none;
        padding: .2em .4em;
        border-radius: .2em;
        background-color: $base-color;
        color: white;;
        transition: 0.1s;
      }

      input[type=file]::file-selector-button:hover {
        height: 30px;
        widhth: 100px;
        background-color: $sec-color;
        color: $base-color;
        border: none;
      }

    }
    .product-title{
      margin-bottom: 10px;
    }
    .message-for-upload{
      position: absolute;
      top: 170px;
      left: 40px;
      color: green;
    }
  }

  .tes-payment-method-mobile{
    @extend .tes-payment-method;
    width: 100%;
    border-top: none;
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