<template>
  <Header msg=""/>

  <OrikomiStatusTimeLine/>

  <div class="mt-5" :class="device.mobile ? 'container-mobile' : 'container'">
    <h4 class="page-title">オーダー/詳細</h4>

    <div class="button-container"><button class="button" @click="goMapToReorder()">この註文情報を用いて再注文</button></div>

    <div class="content-header">註文情報</div>
    <div class="content-items">
      <div class="content-col">
        <div><b>注文日:</b> {{co().created_at.substr(0,16)}}</div>  
        <div><b>配布地域:</b> {{co().extra.points[0] + co().extra.points[1] + co().extra.points[2]}}</div>
        <div><b>入稿期限日:</b> {{co().extra.upload_limit_date.substr(0,16)}}</div>
        <div><b>仕様:</b> <p v-html="getSpecificationOrikomi(co())"></p></div>
      </div>
      
      <div class="content-col">
        <div><b>註文番号:</b> {{co().order_key}}</div>
        <div><b>配布部数:</b> {{co().estimation.quantity.toLocaleString()}}</div>
        <div><b>納品予定日:</b> {{co().extra.shipping_limit_date}}</div>
      </div>
  
      <div class="content-col">
        <div><b>配布ステイタス:</b> {{this.allMenuStore.getters.findPostingStatusJName(co().status)}}</div>
        <div><b>配布完了予定日:</b> {{co().insertion_date}}</div>
      </div>
    </div>

    <div class="content-header">入稿データをアップロード<span class="font-es-s">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;現在の入稿データファイル名 :</span><span id="file_name" class="font-es-s" ></span></div>
    <div :class="device.mobile ? 'content-items-mobile' : null" class="content-items ">
      <div class="items-spinner">
        <div id="file-upload-spinner" class="first-spinner"></div>
        <form>
          <input type="file" id="file1" @change="uploadMediaData()">
        </form>
      </div>

      <div class="items-spinner">
        <div id="file-download-spinner" :class="device.mobile ? 'second-spinner-mobile' : 'second-spinner'"></div>
        <button class="button" @click="downloadMediaData()">確認のためダウンロード</button>
      </div>
    </div>

    <div class="content-header"> 発送先</div>
    <div class="content-items">
      <div class="text-items-warning">只今原稿確認プロセス及び、発送先確定作業中です。今しばらくお待ちください。</div>
    </div>

    <div class="content-header">配布エリア / 配布報告ダウンロード</div>
    <div class="content-items">
      <div style="display: flex;">
        <div class="items-spinner">
          <div id="area-list-download-spinner" class="first-spinner"></div>
          <button class="button" @click="downloadAreaList()">配布エリアダウンロード</button>
        </div>
  
        <div class="items-spinner">
          <div id="report-download-spinner" :class="device.mobile ? 'second-spinner-mobile' : 'second-spinner'"></div>
          <button class="button" @click="downloadReport()">配布報告書ダウンロード</button>
        </div>
      </div>
    </div>

    <div class="content-header">御見積書 / 御請求書ダウンロード</div>
    <div class="content-items">
      <div style="display: flex;">  
        <div class="items-spinner">
          <div id="estimation-download-spinner" class="first-spinner"></div>
          <button class="button" @click="downloadEstimation()">御見積書のダウンロード</button>
        </div>
      </div>
    </div>
  </div>
  <Footer :relative="true"/>
</template>

<script>
import {orderStore} from "../store/order-store";
import Header from '@/components/Header.vue';
import OrikomiStatusTimeLine from "@/components/OrikomiStatusTimeLine";
import backendApi from "@/apis/backend-api";
import {allMenuStore} from "../store/all-menu-store";
import {authStore} from "../store/auth-store";
import {orikomiDomain} from "../utils/baseConsts";
import {BIconCircleFill, BIconPlusSquareFill,BIconCheck2Square, BIconX, BIconXCircleFill, BIconXSquare} from "bootstrap-icons-vue"
import Footer from "../components/Footer";
import {mapModeStore} from "../store/map-mode-store";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//import {BIconCircleFill, BIconPlusSquareFill,BIconCheck2Square, BIconX, BIconXCircleFill, BIconXSquare} from "../../node_modules/bootstrap-icons-vue"


//let orderForDetail = {}
//let currentFileName = ""
export default {
  name: "OrderDetailOrikomi",
  components: {
    Header,
    OrikomiStatusTimeLine,
    BIconPlusSquareFill,
    BIconCheck2Square,
    Footer,
  },
  data(){
    return {
      orderStore,
      allMenuStore,
      authStore,
      device,

    }
  },
  async mounted () {
    document.querySelector('body').style.overscrollBehaviorY = 'auto';
    document.querySelector('body').style.overflow = 'auto';
    // orderForDetail = {}
    //  const resp =  await backendApi.refOrderWithIdAndUserId(this.$route.params.id)
    //this.orderStore.commit("updateCurrentOrder",resp.value)
    if(this.orderStore.getters.currentOrder.order_key  !=  this.$route.params.order_key){
      const resp =  await backendApi.refOrderOrikomi(this.$route.params.order_key)
      this.orderStore.commit("updateCurrentOrder",resp.value)
    }

    const resp2 = await backendApi.refOrderFileNameOrikomi(this.orderStore.getters.currentOrder.order_key)
    if(resp2.value.file_name){
      document.getElementById("file_name").innerText = resp2.value.file_name
    }else{
      document.getElementById("file_name").innerText = "未入稿"
    }

    // currentFileName = resp2.value.file_name

    //  orderForDetail = resp.value;
  },
  methods:{
    goMapToReorder(){
      mapModeStore.commit("clearMode");
      // alert(planKey)
      mapModeStore.commit("updateOrderKeyOrikomi",this.co().order_key);
      // alert(mapModeStore.getters.mapUrlOption)
      location.href = "/orikomi_map";

    },
    co(){
      var x = this.orderStore.getters.currentOrder
      return x
    },
    getSpecification(order){
      /*仕様:チラシ・フライヤー A4 両面カラー 光沢紙(コート) 標準：90kg ポスティング(2022/05/17配布完了希望、配布方法：標準配布)部　数:1,682部*/
      // let specification =
      let specification = allMenuStore.getters.findPaperSizeJName(order.paper_size) + " / " + allMenuStore.getters.findMethodsJName(order.method) + " / " + allMenuStore.getters.findAreaLevelJName(order.area_level)
      return specification
    },
    getSpecificationOrikomi(plan){
      let preSpecification = ""
      preSpecification = "<span class='left'>中心部:&nbsp;" + plan.extra.points[0] + plan.extra.points[1] + plan.extra.points[2] + "</span>"
      let blandNames = ""
      for(let i = 0 ; i < plan.estimation.items.length; i++ ){
        if ( i == 0){
          blandNames  = plan.estimation.items[i].brand_name
        }else{
          blandNames  = blandNames + "&nbsp;/&nbsp;" + plan.estimation.items[i].brand_name
        }
      }
      preSpecification = preSpecification + "<div>新聞銘柄:&nbsp;" + blandNames + "</div>" +
          "<div><span class='font-bold'>用紙サイズ:&nbsp;</span>" +  plan.paper_size + "&nbsp;/&nbsp;<span class='font-bold'>厚さ:&nbsp;</span>" + plan.thickness + "</div>" +
          "<div>折込部数:&nbsp;" + plan.estimation.quantity.toLocaleString() + "</div>"
      return preSpecification
    },
    downloadStatsInfo(){
      ///api/v2/order/stats_info/download
      let co = this.co()
      const obj = {
        order_id : co.id
      }
      document.getElementById("stat-info-spinner").classList.add("spinner-border")
      fetch('https://'  +  orikomiDomain  + '/api/v2/order/stats_info/download',{
        method :'POST',
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization':authStore.state.token
        },
        body: JSON.stringify(obj),
      })
          .then(response => response.json())
          .then(data => {
            if(data.result != "success"){

              if(document.getElementById("stat-info-spinner").classList.contains("spinner-border")){
                document.getElementById("stat-info-spinner").classList.remove("spinner-border")
              }
            }

            if(data.error_message == "session_error"){
              if(document.getElementById("stat-info-spinner").classList.contains("spinner-border")){
                document.getElementById("stat-info-spinner").classList.remove("spinner-border")
              }
              return;
            }
            if(data.result == "success") {
              let fileData = data.value.file_data;
              let fileName = data.value.file_name;
              {
                fetch("data:text/plain;charset=UTF-8;base64," + fileData)
                    .then(response => response.blob())
                    .then(data => {
                          var a = document.createElement("a");
                          a.href = URL.createObjectURL(data);
                          a.target = '_blank';
                          a.download = fileName;
                          a.type = "text/plain"
                          a.click();

                          if(document.getElementById("stat-info-spinner").classList.contains("spinner-border")){
                            document.getElementById("stat-info-spinner").classList.remove("spinner-border")
                          }
                        }
                    );
              }
            }
          }).catch(function(error) {

        if(document.getElementById("stat-info-spinner").classList.contains("spinner-border")){
          document.getElementById("stat-info-spinner").classList.remove("spinner-border")
        }
      })
    },
    downloadEstimation(){
      let co = this.co()
      const obj = {
        order_id : co.id
      }
      document.getElementById("estimation-download-spinner").classList.add("spinner-border")
      fetch('https://'  + orikomiDomain  + '/api/v2/order/estimation_pdf/download',{
        method :'POST',
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization':authStore.state.token
        },
        body: JSON.stringify(obj),
      })
          .then(response => response.json())
          .then(data => {
            console.log("data",data)
            if(data.result != "success"){

              if(document.getElementById("estimation-download-spinner").classList.contains("spinner-border")){
                document.getElementById("estimation-download-spinner").classList.remove("spinner-border")
              }
            }

            if(data.error_message == "session_error"){
              if(document.getElementById("estimation-download-spinner").classList.contains("spinner-border")){
                document.getElementById("estimation-download-spinner").classList.remove("spinner-border")
              }
              return;
            }
            if(data.result == "success") {
              let fileData = data.value.file_data;
              let fileName = data.value.file_name;
              {
                fetch("data:application/pdf;charset=UTF-8;base64," + fileData)
                    .then(response => response.blob())
                    .then(data => {
                          var a = document.createElement("a");
                          a.href = URL.createObjectURL(data);
                          a.target = '_blank';
                          a.download = fileName;
                          a.type = "application/pdf"
                          a.click();

                          if(document.getElementById("estimation-download-spinner").classList.contains("spinner-border")){
                            document.getElementById("estimation-download-spinner").classList.remove("spinner-border")
                          }
                        }
                    );
              }
            }
          }).catch(function(error) {

        if(document.getElementById("estimation-download-spinner").classList.contains("spinner-border")){
          document.getElementById("estimation-download-spinner").classList.remove("spinner-border")
        }
      })
    },
    downloadReport(){
      let co = this.co()

      if(co.posting_status != 5){
        alert("レポートをダウンロードするには、配布ステータスが、" + this.allMenuStore.getters.findPostingStatusJName(5) + "である必要があります。");
        return;
      }


      document.getElementById("report-download-spinner").classList.add("spinner-border");

      const obj = {
        order_id : co.id
      }
      fetch('https://'  + baseDomain  + '/api/v2/order/report/download',{
        method :'POST',
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization':authStore.state.token
        },
        body: JSON.stringify(obj),
      })
          .then(response => response.json())
          .then(data => {
            if(data.result != "success"){

              if(document.getElementById("report-download-spinner").classList.contains("spinner-border")){
                document.getElementById("report-download-spinner").classList.remove("spinner-border")
              }
            }

            if(data.error_message == "session_error"){
              if(document.getElementById("report-download-spinner").classList.contains("spinner-border")){
                document.getElementById("report-download-spinner").classList.remove("spinner-border")
              }
              return;
            }
            if(data.result == "success") {
              let fileData = data.value.file_data;
              let fileName = data.value.file_name;
              {
                fetch("data:text/plain;charset=UTF-8;base64," + fileData)
                    .then(response => response.blob())
                    .then(data => {
                          var a = document.createElement("a");
                          a.href = URL.createObjectURL(data);
                          a.target = '_blank';
                          a.download = fileName;
                          a.click();

                          if(document.getElementById("report-download-spinner").classList.contains("spinner-border")){
                            document.getElementById("report-download-spinner").classList.remove("spinner-border")
                          }
                        }
                    );
              }
            }
          }).catch(function(error) {

        if(document.getElementById("report-download-spinner").classList.contains("spinner-border")){
          document.getElementById("report-download-spinner").classList.remove("spinner-border")
        }
      })
    },
    downloadAreaList(){
      document.getElementById("area-list-download-spinner").classList.add("spinner-border");
      let co = this.co()
      const obj = {
        order_id : co.id
      }
      fetch('https://'  + orikomiDomain  + '/api/v2/order/area_list/download',{
        method :'POST',
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization':authStore.state.token
        },
        body: JSON.stringify(obj),
      })
          .then(response => response.json())
          .then(data => {
            if(data.result != "success"){

              if(document.getElementById("area-list-download-spinner").classList.contains("spinner-border")){
                document.getElementById("area-list-download-spinner").classList.remove("spinner-border")
              }
            }

            if(data.error_message == "session_error"){
              if(document.getElementById("area-list-download-spinner").classList.contains("spinner-border")){
                document.getElementById("area-list-download-spinner").classList.remove("spinner-border")
              }
              return;
            }
            if(data.result == "success") {
              let fileData = data.value.file_data;
              let fileName = data.value.file_name;
              {
                fetch("data:text/plain;charset=UTF-8;base64," + fileData)
                    .then(response => response.blob())
                    .then(data => {
                          var a = document.createElement("a");
                          a.href = URL.createObjectURL(data);
                          a.target = '_blank';
                          a.download = fileName;
                          a.click();

                          if(document.getElementById("area-list-download-spinner").classList.contains("spinner-border")){
                            document.getElementById("area-list-download-spinner").classList.remove("spinner-border")
                          }
                        }
                    );
              }
            }
          }).catch(function(error) {

        if(document.getElementById("area-list-download-spinner").classList.contains("spinner-border")){
          document.getElementById("area-list-download-spinner").classList.remove("spinner-border")
        }
      })
    },
    downloadMediaData(){
      document.getElementById("file-download-spinner").classList.add("spinner-border");
      let co = this.co()
      console.log("co",co)
      const obj = {
        order_key : co.order_key
      }
      //  let filename = "media.ai";
      fetch('https://'  + orikomiDomain  + '/api/v1/order/download_media',{
        method :'POST',
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization':authStore.state.token
        },
        body: JSON.stringify(obj),
      })
          .then(response => response.json())
          .then(data => {
            console.log("downloadMediaData", data)
            if(data.result != "success"){

              if(document.getElementById("file-download-spinner").classList.contains("spinner-border")){
                document.getElementById("file-download-spinner").classList.remove("spinner-border")
              }
            }

            if(data.error_message == "session_error"){
              if(document.getElementById("file-download-spinner").classList.contains("spinner-border")){
                document.getElementById("file-download-spinner").classList.remove("spinner-border")
              }
              return;
            }
            if(data.result == "success") {
              let fileData = data.value.file_data;
              let fileName = data.value.file_name;
              {
                fetch("data:text/plain;charset=UTF-8;base64," + fileData)
                    .then(response => response.blob())
                    .then(data => {
                          var a = document.createElement("a");
                          a.href = URL.createObjectURL(data);
                          a.target = '_blank';
                          a.download = fileName;
                          a.click();

                          if(document.getElementById("file-download-spinner").classList.contains("spinner-border")){
                            document.getElementById("file-download-spinner").classList.remove("spinner-border")
                          }
                        }
                    );
              }
            }
          }).catch(function(error) {

        if(document.getElementById("file-download-spinner").classList.contains("spinner-border")){
          document.getElementById("file-download-spinner").classList.remove("spinner-border")
        }
      })
    },
    async uploadMediaData(){

      let co = this.co()
      if(!  document.getElementById("file1").value ){
        console.log('No file is selected.');
        return
      }
      console.log("a")
      // let sock = new WebSocket("wss://"+ backendApi.backendWebSocketDomain);

      document.getElementById("file-upload-spinner").classList.add("spinner-border")

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
          document.getElementById("file_name").innerText = file.name;
        }




        if (data.mile_stone == "next_to_process"){
          parseFile(file,function(result,offset,size){
            console.log(offset)
            console.log(size)
            sock.send(result);
          });
        }

        /*
        * 	Error       string  `json:"err"`
Process     float64 `json:"process_ratio"`
MileStone   string  `json:"mile_stone"`
Description string  `json:"desc"`
Result      string  `json:"result"`
        *
        * */

      },
          sock.onclose = function(event){
            sock.close()
            document.getElementById("file-upload-spinner").classList.remove("spinner-border");

          },
          sock.onopen = function(event){
            console.log("cc")

            let sendDataPre = {
              token:authStore.getters.rawToken,
              order_key: co.order_key,
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
    async updateTrackingInfo(orderId,destinationId){
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
      const respData = await backendApi.updateTrackingInfo(orderId,destinationId,shippingCompany,trackingsStr,'orikomi')

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
    existTrackingInput(orderId,destinationId,trackingText){
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
    getShippingAddress(dest){
      let destination = "<div class='destination_name'>発送先名: " +dest.name  + "</div>"
      return destination
    }
  }
}

</script>
<style lang="scss">
@import '../assets/css/base.css';

$base-color: #FF8C00;
$sec-color: #FFE6C7;

$main-button-width: 200px;
$main-button-height: 60px;


body{
  overflow-y: scroll !important;
  overflow: scroll !important;
}

.page-title {
  font-weight: 900;
  margin-top: 20px;
  white-space: nowrap;
}

.page-title-mobile{
  white-space: nowrap;
  font-weight: 900;
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 40px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .button {
    color: $base-color;
    border: 1px solid $base-color;
    background-color: white;
    font-weight: 900;
    padding: 10px 20px;
    border-radius: 10px;
    &:hover {
      background-color: $sec-color;
    }
  }
}

.content-header {
  background-color: $sec-color;
  padding: 10px 20px;
  text-align: start;
  font-weight: 900;
  border-radius: 10px;
  margin-bottom: 15px;
}

.content-items {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin-bottom: 10px;
  .content-col{
    width: calc((100% - 10px) / 3);
    display: flex;
    flex-direction: column;
    text-align: start;
    div{
     margin-bottom: 5px; 
    }
  }
  .button {
    background-color: $base-color;
    color: white;
    font-weight: 900;
    padding: 10px 20px;
    border-radius: 10px;
    &:hover {
      background-color: $sec-color;
      color: $base-color;
    }
  }
  .text-items-warning{
    color: #CD0000;
  }
  .items-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    margin-bottom: 10px;
    
    input[type=file]::file-selector-button {
        border: none;
        font-weight: 700;
        border-radius: 10px;
        padding: 10px 20px;
        background-color: $base-color;
        color: white;;
        transition: 0.1s;
      }

      input[type=file]::file-selector-button:hover {
        background-color: $sec-color;
        color: $base-color;
        border: none;
      }
  }
}
.content-items-mobile {
  flex-direction: column;
  align-items: start;
  justify-content: start;
  .button{
    margin-left: 5px;
  }
}
.container {
  margin-top: 40px;
}

.container-mobile{
  padding: 0px 20px;
  margin-top: 0px;
  width: 100%;
}

.first-spinner {
  color: $base-color;
  margin-right: 5px;
}
</style>