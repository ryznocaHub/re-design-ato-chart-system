<template>
  <Header msg=""/>

 <PostingStatusTimeLine/>

  <div :class="device.mobile ? 'container-mobile' : 'container'">
    <h4 :class="device.mobile ? 'page-title-mobile' : 'page-title'" >オーダー/詳細</h4>
  
    <div class="button-container"><button class="button" @click="goMapToReorder()">この註文情報を用いて再注文</button></div>
  
    <div class="content-header">註文情報</div>
    <div class="content-items">
      <div class="content-col">
        <div><b>注文日:</b>  {{co().created_at.substr(0,16)}}</div>  
        <div><b>配布地域:</b> {{co().extra.posting_area }}</div>
        <div><b>入稿期限日:</b> {{co().extra.upload_limit_date.substr(0,16)}}</div>
        <div><b>仕様:</b> {{getSpecification(co())}}</div>
      </div>
      
      <div class="content-col">
        <div><b>註文番号:</b> {{co().print_order_id}}</div>
        <div><b>配布部数:</b> {{co().computed_quantity.toLocaleString()}}</div>
        <div><b>納品予定日:</b> {{co().scheduled_order_date}}</div>
      </div>
  
      <div class="content-col">
        <div><b>配布ステイタス:</b> {{this.allMenuStore.getters.findPostingStatusJName(co().posting_status)}}</div>
        <div><b>配布完了予定日:</b> {{co().accepted_posting_date}}</div>
      </div>
    </div>
    
    <div class="content-header">入稿データをアップロード <span class="font-es-s">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;現在の入稿データファイル名 :</span><span id="file_name" class="font-es-s" ></span></div>
    <div :class="device.mobile ? 'content-items-mobile' : null" class="content-items ">
      <div class="items-spinner">
        <div id="file-upload-spinner" class="first-spinner"></div>
        <form>
          <input type="file" id="file1" @change="uploadMediaData()" hidden>
          <label for="file1">ファイルの選択</label>
        </form>
        <div v-if="!isFileUploaded" class="error-container">未選択</div>
      </div>

      <div class="items-spinner">
        <div id="file-download-spinner" :class="device.mobile ? 'second-spinner-mobile' : 'second-spinner'"></div>
        <button class="button" @click="downloadMediaData()" :disabled="!isFileUploaded">確認のためダウンロード</button>
        <div v-if="!isFileUploaded" class="error-container">まだアップロードされていません</div>
      </div>
    </div>

    <div class="content-header"> 発送先</div>
    <div class="content-items">
      <div v-if="! co().sync.synced" class="text-items-warning">只今原稿確認プロセス及び、発送先確定作業中です。今しばらくお待ちください。</div>
      <div v-if="co().sync.synced">
        <div  :id="'destination_detail_' + co().id + '_' + destination.id" class="destination_detail" v-for="(destination,j) in co().destination_obj_array" :key="j">
          <div class="label" v-html="getShippingAddress(destination)" ></div>
          <div class="label">〒{{destination.zip}} {{destination.address}}</div>
          <div class="label">TEL:{{destination.tel}}</div>
          <div class="label">発送部数:{{destination.quantity.toLocaleString()}}部</div>
          <div class="label">運送会社名およびトラッキング番号を登録ください</div>
          <!-- <div class="tracking_info_register_mobile_label" v-if="device.mobile">
            <div class="mobile_label">運送会社名:</div>
            <div class="mobile_label">追跡番号:</div>
          </div> -->
          <div style="display: flex;">
            <div class="tracking-container">
              <label class="tracking-label">運送会社名:</label>
              <input :id="'shipping_company_input_' + co().id + '_' + destination.id" class="tracking-input" type="text" :value="destination.shipping_company" />
            </div>

            <div class="tracking-container">
              <label class="tracking-label">追跡番号:</label>
              <input :id="'first_tracking_input_' + co().id + '_' + destination.id" class="tracking-input" type="text" :value="firstTrackingNumber(destination.tracking)" />
            </div>
            
            <div class="tracking-container-button">
              <BIconPlus class="icon orange" @click="addTrackingInput(co().id,destination.id)"/>
              <BIconCheck2 class="icon green" @click="updateTrackingInfo(co().id,destination.id)"/>
            </div>
          </div>
            

          <div class="tracking_info_register_existed">
            <div :class="device.mobile ? 'hol_spacer-mobile' : 'hol_spacer'"></div>
            <div :id="'tracking_exist_' + co().id + '_' +destination.id" v-html="existTrackingInput(co().id,destination.id,destination.tracking)"></div>
          </div>
          <div class="tracking_info_register_add">
            <div :class="device.mobile ? 'hol_spacer-mobile' : 'hol_spacer'"></div>
            <div :id="'tracking_add_' + co().id + '_' + destination.id"></div>
          </div>
        </div>
      </div>
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
import PostingStatusTimeLine from "@/components/PostingStatusTimeLine";
import backendApi from "@/apis/backend-api";
import {allMenuStore} from "../store/all-menu-store";
import {authStore} from "../store/auth-store";
import {baseDomain} from "../utils/baseConsts";
import {BIconCircleFill, BIconPlus,BIconCheck2, BIconX, BIconXCircleFill, BIconXSquare} from "bootstrap-icons-vue"
import Footer from "../components/Footer";
import {mapModeStore} from "../store/map-mode-store";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//import {BIconCircleFill, BIconPlusSquareFill,BIconCheck2Square, BIconX, BIconXCircleFill, BIconXSquare} from "../../node_modules/bootstrap-icons-vue"


//let orderForDetail = {}
//let currentFileName = ""
export default {
  name: "OrderDetail",
  components: {
    Header,
    PostingStatusTimeLine,
    BIconPlus,
    BIconCheck2,
    Footer,
  },
  data(){
    return {
      orderStore,
      allMenuStore,
      authStore,
      device,
      isFileUploaded: false
    }
  },
  async mounted () {
    document.querySelector('body').style.overscrollBehaviorY = 'auto';
    document.querySelector('body').style.overflow = 'auto';
    // orderForDetail = {}
    //  const resp =  await backendApi.refOrderWithIdAndUserId(this.$route.params.id)
      //this.orderStore.commit("updateCurrentOrder",resp.value)
     if(this.orderStore.getters.currentOrder.id  !=  this.$route.params.id){
       const resp =  await backendApi.refOrderWithIdAndUserId(this.$route.params.id)
       this.orderStore.commit("updateCurrentOrder",resp.value)
    }

      const resp2 = await backendApi.refOrderFileName(this.orderStore.getters.currentOrder.print_order_id)
      if(resp2.value.file_name){
        document.getElementById("file_name").innerText = resp2.value.file_name
        this.isFileUploaded = true
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
       mapModeStore.commit("updatePrintOrderId",this.co().print_order_id);
       // alert(mapModeStore.getters.mapUrlOption)
       location.href = "/map";

     },
     co(){
       return this.orderStore.getters.currentOrder
     },
      getSpecification(order){
        /*仕様:チラシ・フライヤー A4 両面カラー 光沢紙(コート) 標準：90kg ポスティング(2022/05/17配布完了希望、配布方法：標準配布)部　数:1,682部*/
        // let specification =
        let specification = allMenuStore.getters.findPaperSizeJName(order.paper_size) + " / " + allMenuStore.getters.findMethodsJName(order.method) + " / " + allMenuStore.getters.findAreaLevelJName(order.area_level)
        return specification
      },
      downloadStatsInfo(){
       ///api/v2/order/stats_info/download
        let co = this.co()
        const obj = {
          order_id : co.id
        }
        document.getElementById("stat-info-spinner").classList.add("spinner-border")
        fetch('https://'  + baseDomain  + '/api/v2/order/stats_info/download',{
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
        fetch('https://'  + baseDomain  + '/api/v2/order/estimation_pdf/download',{
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
        fetch('https://'  + baseDomain  + '/api/v2/order/area_list/download',{
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
        const obj = {
          print_order_id : co.print_order_id
        }
      //  let filename = "media.ai";
        fetch('https://'  + baseDomain  + '/api/v2/order/file/download',{
          method :'POST',
          headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization':authStore.state.token
          },
          body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(data => {
              console.log("確認のためダウンロード", data)
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
                console.log("data.mile_stone ==")
                this.isFileUploaded = true
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
            id : Number(co.id),
            print_order_id: co.print_order_id,
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
              console.log("offset >= fileSize")
              this.isFileUploaded = true
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
        if(document.getElementById("file1").value ){
            console.log("getElementById")
            this.isFileUploaded = true
           return
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
        const respData = await backendApi.updateTrackingInfo(orderId,destinationId,shippingCompany,trackingsStr,'posting')

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

        document.getElementById("tracking_add_" + orderId + "_" + destinationId).innerHTML += "<input class='tracking-input' type='text' /><br>";

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
}

.page-title-mobile{
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
    &:disabled {
      color: white;
      background-color: $sec-color;
      cursor: not-allowed;
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
    
    label {
      font-weight: 700;
      border-radius: 10px;
      padding: 10px 20px;
      background-color: $base-color;
      color: white;
      transition: 0.1s;
      &:hover {
        background-color: $sec-color;
        color: $base-color;
      }
    }
    input[type=file]::file-selector-button {
      border: none;
      font-weight: 700;
      border-radius: 10px;
      padding: 10px 20px;
      background-color: $base-color;
      color: white;
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

.destination_detail{
  text-align: start;
  .tracking-container{
    padding-bottom: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
  }
  .tracking-container-button{
    // @extend .tracking-container;
    align-self: self-end;
    padding-bottom: 27px;
  }
  .tracking-input{
    padding: 5px 10px;
    border: 1px solid #EBEBEB;
    border-radius: 5px;
    background-color: #EBEBEB;
    &:focus{
      outline: none;
      color: $base-color;
      border: 1px solid $base-color;
    }
    &:hover{
      outline: none;
      color: $base-color;
      border: 1px solid $base-color;
    }
  }
  .icon{
    font-size: 30px;
    padding: 5px;
    border-radius: 50%;
    margin-right: 10px;
    &:hover{
      cursor: pointer;
      background-color: white;
    }
  }
  .green {
    @extend .icon;
    font-weight: 800;
    background-color: #EEFFF3;
    border: 1px solid #23A047;
    color: #23A047;
  }
  .orange {
    @extend .icon;
    font-weight: 800;
    background-color: rgb(255, 243, 227);
    border: 1px solid $base-color;
    color: $base-color;
  }
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

.error-container {
    color: #CD0000;
    font-weight: 600;
    text-align: right;
    margin-left: 5px;
  }
</style>