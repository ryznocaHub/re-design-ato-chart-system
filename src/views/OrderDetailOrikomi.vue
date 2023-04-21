<template>
  <Header msg=""/>

 <PostingStatusTimeLine/>

  <div class="mt-5"
       :class="device.mobile ? 'container-mobile' : 'container'">

      <h4 class="page-title">オーダー/詳細</h4>

    <div class="menu-icons-container"><button class="reorder" @click="goMapToReorder()">この註文情報を用いて再注文</button></div>
      <div :class="device.mobile ? 'order-spec-mobile' : 'order-spec'">
        <div class="order-spec-header">註文情報</div>
        <div  class="order-spec-row1"><div class="created-at">注文日:  {{co().created_at.substr(0,16)}}</div><div class="print-order-id">註文番号: {{co().order_key}}</div><div class="posting-status">配布ステイタス: {{this.allMenuStore.getters.findPostingStatusJName(co().status)}}</div></div>
        <div class="order-spec-row2"><div class="posting-area">配布地域：　{{co().extra.points[0] + co().extra.points[1] + co().extra.points[2]}}</div><div class="computed-quantity">配布部数： {{co().estimation.quantity.toLocaleString()}}</div><div class="hol_space"></div></div>
        <div class="order-spec-row3"><div class="upload-limit-date">入稿期限日: {{co().extra.upload_limit_date.substr(0,16)}}</div><div class="scheduled-order-date">納品予定日: {{co().extra.shipping_limit_date}}</div><div class="accepted-posting-date">配布完了予定日: {{co().insertion_date}}</div></div>
        <div class="order-spec-row4"><div class="specification">仕様： {{getSpecificationOrikomi(co())}}</div></div>
      </div>

     <div class="wrap-container">
       <div :class="device.mobile ? 'file-upload-download-div-mobile' : 'file-upload-download-div'">
         <div id="file-upload-spinner" class="first-spinner theme-text-color"></div>
         <div class="file-upload-download-div-header">入稿データをアップロード <span class="font-es-s">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;現在の入稿データファイル名 :</span><span id="file_name" class="font-es-s" ></span></div>
         <div class="upload-div">
            <form>
              <input type="file" id="file1"
              @change="uploadMediaData()">
            </form>
         </div>
         <div id="file-download-spinner" class="theme-text-color"
              :class="device.mobile ? 'second-spinner-mobile' : 'second-spinner'"></div>
         <div :class="device.mobile ? 'download-div-mobile' : 'download-div'">
           <button class="order-file-download"
           @click="downloadMediaData()">確認のためダウンロード
           </button>
         </div>
       </div>

       <div :class="device.mobile ? 'destination-div-mobile' : 'destination-div'">
         <div class="destination-div-header">発送先</div>

         <div v-if="! co().extra.sync.synced" class="warning-sync destination_detail">只今原稿確認プロセス及び、発送先確定作業中です。今しばらくお待ちください。</div>
         <div v-if="co().extra.sync.synced" :id="'destination_detail_' + co().order_key + '_' + destination.id" class="destination_detail" v-for="(destination,j) in co().destination_obj_array">
           <div class="shipping_address" v-html="getShippingAddress(destination)" ></div>
           <div class="shipping_address">〒{{destination.zip}} {{destination.address}}</div>
           <div class="shipping_address">TEL:{{destination.tel}}</div>
           <div class="shipping_address">発送部数:{{destination.quantity.toLocaleString()}}部</div>
           <div class="tracking_info">運送会社名およびトラッキング番号を登録ください</div>
           <div class="tracking_info_register_mobile_label" v-if="device.mobile"><div class="mobile_label">運送会社名:</div><div class="mobile_label">追跡番号:</div></div>
           <div class="tracking_info_register"><label v-if="! device.mobile"  class="label-delivery-company">運送会社名:</label><div><input :id="'shipping_company_input_' + co().id + '_' + destination.id" class="delivery-company-input" type="text" :value="destination.shipping_company" /></div> <label v-if="! device.mobile"  class="label-tracking-number">追跡番号:</label><div class="tracking-div"><input :id="'first_tracking_input_' + co().id + '_' + destination.id" class="tracking-number-input" type="text" :value="firstTrackingNumber(destination.tracking)" /></div> <div class="tracking-plus" > <BIconPlusSquareFill @click="addTrackingInput(co().id,destination.id)"/></div><div class="tracking-check"><BIconCheck2Square @click="updateTrackingInfo(co().id,destination.id)"/></div> </div>
           <div class="tracking_info_register_existed"><div :class="device.mobile ? 'hol_spacer-mobile' : 'hol_spacer'"></div><div :id="'tracking_exist_' + co().id + '_' +destination.id" v-html="existTrackingInput(co().id,destination.id,destination.tracking)"></div></div>
           <div class="tracking_info_register_add"><div :class="device.mobile ? 'hol_spacer-mobile' : 'hol_spacer'"></div><div :id="'tracking_add_' + co().id + '_' + destination.id"></div></div>
         </div>
         <!--
         ID	郵便番号	住所	名前	担当者	tel	mail	部数	配送会社	追跡番号	編集削除

         6% 7% 25% 12%  12%  8%  15%  15%
         /*
6% 7% 25% 12%  12%  8%  15%  15%

	Id      int64  `json:"id"`
	Name string `json:"name"`
	PostingArea string `json:"posting_area"`
	Zip     string `json:"zip"`
	Address string `json:"address"`
	Quantity  int64 `json:"quantity"`
	ShippingCompany string `json:"shipping_company"`
	PIC string   `json:"pic"`
	Tel string   `json:"tel"`
	Mail string   `json:"mail"`
	Tracking string `json:"tracking"`
	TrackingArray []string `json:"-"`
	Memo     string `json:"memo"`
	Index    int64  `json:"index"`
	ContractorId int64 `json:"contractor_id"`
	ApplyType       string `json:"-"` //conf.ApplyTypeUseProfitRatio か、conf.ApplyTypeDirect
	Area            string `json:"-"`  //この場合は、東京中心部、横浜中心部など、あるいは福岡県など、定義されたエリアのどこに該当するか
*/
         -->

         </div>
         <div :class="device.mobile ? 'order-info-download-div-mobile' : 'order-info-download-div'">
           <div class="order-info-download-div-header">注文統計属性情報ダウンロード</div>
           <div id="stat-info-spinner" class="first-spinner theme-text-color"></div>
           <div class="download-div-left">
          <!--   <button class="area-list-download" @click="downloadStatsInfo()">注文統計属性情報ダウンロード</button> -->
           </div>
         </div>
         <div :class="device.mobile ? 'area-info-download-div-mobile' : 'area-info-download-div'">
           <div class="area-info-download-div-header">配布エリア / 配布報告ダウンロード</div>
           <div id="area-list-download-spinner" class="first-spinner theme-text-color"></div>
           <div class="download-div-left">
             <button class="area-list-download" @click="downloadAreaList()">配布エリアダウンロード</button>
           </div>
           <div id="report-download-spinner" class="theme-text-color"
                                             :class="device.mobile ? 'second-spinner-mobile' : 'second-spinner'"></div>
           <div :class="device.mobile ? 'download-div-right-mobile' : 'download-div-right'">
             <button class="posting-report-download" @click="downloadReport()">配布報告書ダウンロード</button>
           </div>
         </div>
         <div :class="device.mobile ? 'payment-info-download-div-mobile' : 'payment-info-download-div'">
           <div class="payment-info-download-div-header">御見積書 / 御請求書ダウンロード</div>
           <div id="estimation-download-spinner" class="first-spinner theme-text-color"></div>
           <div class="download-div-left">
             <button class="estimation-download" @click="downloadEstimation()">御見積書のダウンロード</button>
           </div>
        <!--   <div class="second-spinner spinner-border theme-text-color"></div>
           <div class="download-div-right">
             <button class="invoice-download">御請求書のダウンロード</button>
           </div> -->
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
    PostingStatusTimeLine,
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
       mapModeStore.commit("updatePrintOrderId",this.co().order_key);
       // alert(mapModeStore.getters.mapUrlOption)
       location.href = "/orikomi_map";

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
      getSpecificationOrikomi(plan) {
        let preSpecification = ""
        preSpecification = "<p className='left'>中心部:&nbsp;" + plan.extra.points[0] + plan.extra.points[1] + plan.extra.points[2] + "</p>"
        let blandNames = ""
        for (let i = 0; i < plan.estimation.items.length; i++) {
          if (i == 0) {
            blandNames = plan.estimation.items[i].brand_name
          } else {
            blandNames = blandNames + "&nbsp;/&nbsp;" + plan.estimation.items[i].brand_name
          }
        }
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
        const respData = await backendApi.updateTrackingInfo(orderId,destinationId,shippingCompany,trackingsStr)

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

$main-button-width: 200px;
$main-button-height: 60px;


body{
  overflow-y: scroll !important;
  overflow: scroll !important;
}

.container-mobile{
  width: 100%;
  margin: auto;
}

.page-title {
  margin-top: 20px;
}

.ui-row{
  display: flex;
  position: relative;
  align-items : center;
  border: 1px solid #777777;

}

.menu-icons-container{
　　width: 100%;
   align-items: end;
   text-align: right;
  .reorder{
    margin-right: 30px;
    height: $main-button-height;
    width: $main-button-width;
    //.ui-button {
      background-color: white;
      border: 1px solid #777777;
      border-radius: 5px;
      font-size: 14px;
      right: 20px;
      span {
        margin: auto;
      }
      &:hover {
        background-color: whitesmoke;
        cursor: pointer;
      }
  //  }
  }

}

.order-spec{
  @extend .ui-row;
  position: relative;
  border:1px solid #777777;
  display: block;
  width: calc(100% - 40px);
  height: auto;
  margin: 20px;

  .order-spec-header{
    border-bottom:1px solid #777777;
    position: absolute;
    height: 30px;
    width: 100%;
    top: 0;
    left: 0;
    text-align: left;
    padding: 5px;
  }

  .order-spec-row1{
    width: 100%;
    display: flex;
    position: relative;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 10px;
    .created-at{
       text-align: left;
       width: calc(100% / 3);
       margin-left: 20px;
    }
    .print-order-id{
      text-align: left;
      width: calc(100% / 3);
      margin-left: 20px;
    }
    .posting-status{
      text-align: left;
      width: calc(100% / 3);
      margin-left: 20px;
    }
  }
  .order-spec-row2{
    width: 100%;
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 10px;
    .posting-area{
      text-align: left;
      width: calc(100% / 3);
      margin-left: 20px;
    }
    .computed-quantity{
      text-align: left;
      width: calc(100% / 3);
      margin-left: 20px;
    }
    .hol_space{
      width:  calc(100% / 3);
    }
  }
  .order-spec-row3{
    width: 100%;
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 10px;
    .upload-limit-date{
      text-align: left;
      width: calc(100% / 3);;
      margin-left: 20px;
    }
    .scheduled-order-date{
      text-align: left;
      width: calc(100% / 3);
      margin-left: 20px;
    }
    .accepted-posting-date{
      text-align: left;
      width: calc(100% / 3);
      margin-left: 20px;
    }
  }
  .order-spec-row4{
    width: 100%;
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 10px;

    .specification{
      text-align: left;
      width:100%;
      margin-left: 20px;
    }

  }

}

.order-spec-mobile{
  @extend .order-spec;
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  padding: 0;
}

.wrap-container {
  width: 100%;
  height: auto;

  .ui-row{
    display: flex;
    position: relative;
    align-items : center;
    border: 1px solid #777777;

  }

/*
    ref https://getbootstrap.com/docs/4.2/components/spinners/
*/
  .file-upload-download-div{
    position: relative;
    @extend .ui-row;
    width: calc(100% - 40px);
    height: 100px;
    margin: 20px;

    .file-upload-download-div-header{
      border-bottom:1px solid #777777;
      position: absolute;
      height: 30px;
      width: 100%;
      top: 0;
      left: 0;
      text-align: left;
      padding: 5px;

    }
    .first-spinner{
      position: absolute;
      top: 50px;
      left: 20px;
    }

    .upload-div {
      position: absolute;
      top: 50px;
      left: 60px;

      input[type=file]::file-selector-button {
        height: 30px;
        widhth: 100px;
        border: none;
        padding: .2em .4em;
        border-radius: .2em;
        background-color: #2c50a0;
        color: white;
        transition: 0.1s;
      }

      input[type=file]::file-selector-button:hover {
        height: 30px;
        widhth: 100px;
        background-color: #213f81;
        border: none;
      }

    }

    .second-spinner{
      position: absolute;
      top: 50px;
      left: calc(50% - 40px);
    }

    .second-spinner-mobile{
      @extend .second-spinner;
      top: 100px;
      left: 20px;
    }

    .download-div{
      height: 30px;
      widhth: 100px;
      position: absolute;
      top: 50px;
      left: 50%;
      .order-file-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      /*  background-color: #a29bfe;*/
      }
    }

    .download-div-mobile{
      @extend .download-div;
      top: 100px;
      left: 60px;
    }


  }
  .file-upload-download-div-mobile{
    @extend .file-upload-download-div;
    height: 160px;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
  }

  .posting-status-div {
    @extend .ui-row;
    width: calc(100% - 40px);
    height: 200px;
    margin: 20px;
  }

  .posting-status-div-mobile{
    @extend .posting-status-div;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
  }

  .order-detail-div {
    @extend .ui-row;
    width: calc(100% - 40px);
    height: 200px;
    margin: 20px;
  }

  .order-detail-div-mobile{
    @extend .order-detail-div;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;

  }



  .destination-div {
    @extend .ui-row;
    display: block;

    width: calc(100% - 40px);
    height: auto;
    margin: 20px;
    .destination-div-header{
      border-bottom:1px solid #777777;
      position: absolute;
      height: 30px;
      width: 100%;
      top: 0;
      left: 0;
      text-align: left;
      padding: 5px;
    }
    .warning-sync{
      color : red;
      font-size: 15px;
      margin-bottom: 10px;
    }
    .destination_detail{
      width: 100%;
      margin: 20px;
      margin-top: 50px;
      margin-bottom: 50px;
      .shipping_address{
        width: 100%;
        display: flex;
        position: relative;
        align-items: center;
        margin-bottom: 10px;
      }
      .destination_name{
        text-align: left;
        width: 100%;
      }
      .shipping_quantity{
        width: 100%;
        text-align: right;
      }
      .tracking_info{
        position: relative;
        text-align: left;
        .b-icon{
          color: royalblue;
          font-size: 20px;
        }
        .b-icon :hover{
          color: yellow;
        }
      }
      .tracking_info_register_mobile_label{
        display: flex;
        position: relative;
        align-items: center;
        margin-bottom: -10px;
        height: 6vw;
        padding-top: 2vw;

          .mobile_label{
            height: 4vw;
            width: 35%;
            text-align: left;
            margin-bottom: 0;
          }
      }
      .tracking_info_register{
        display: flex;
        position: relative;
        align-items: center;
        .label-delivery-company{
          width: 80px;
        }

        .label-tracking-number{
          width: 65px;
          margin-left: 10px;
        }
        .tracking-plus{
          color: royalblue;
          font-size: 25px;
          margin-bottom: 2px;
          margin-left: 5px;
        }
        .tracking-plus :hover{
          color: navy;
        }
        .tracking-check{
          color: royalblue;
          font-size: 29px;
          margin-bottom: 4px;
          margin-left: 5px;
        }
        .tracking-check :hover{
          color: navy;
        }
        .tracking-div{
          max-width: 160px;
          min-width: 100px
        }
      }
      .tracking_info_register_existed{
        display: flex;
        position: relative;
        align-items: center;
        margin-top: -4px;
        .hol_spacer{
          width: 315px;
        }
        .hol_spacer-mobile{
          width: 32vw;
        }
      }
      .tracking_info_register_add{
        display: flex;
        position: relative;
        align-items: center;
        margin-top: 0px;
        margin-bottom: 0px;
        .hol_spacer{
          width: 315px;
        }
        .hol_spacer-mobile{
          width: 32vw;
        }
      }

    }

  }
  .destination-div-mobile{
    @extend .destination-div;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
      input {
        width: 32vw;
      }
  }

  .order-info-download-div{
    @extend .ui-row;
    width: calc(100% - 40px);
    height: 100px;
    margin: 20px;
    .order-info-download-div-header{
      border-bottom:1px solid #777777;
      position: absolute;
      height: 30px;
      width: 100%;
      top: 0;
      left: 0;
      text-align: left;
      padding: 5px;
    }
    .first-spinner{
      position: absolute;
      top: 50px;
      left: 20px;
    }
    .download-div-left{
      height: 30px;
      widhth: 150px;
      position: absolute;
      top: 50px;
      left: 60px;
      .area-list-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      }
    }
    .second-spinner{
      position: absolute;
      top: 50px;
      left: calc(50% - 40px);
    }
    .download-div-right{
      height: 30px;
      widhth: 150px;
      position: absolute;
      top: 50px;
      left: 50%;
      .posting-report-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      }
    }
  }
   .order-info-download-div-mobile{
     @extend .order-info-download-div;
     width: 98%;
     margin-left: 1%;
     margin-right: 1%;
   }
  .area-info-download-div{
    @extend .ui-row;
    width: calc(100% - 40px);
    height: 100px;
    margin: 20px;
    .area-info-download-div-header{
      border-bottom:1px solid #777777;
      position: absolute;
      height: 30px;
      width: 100%;
      top: 0;
      left: 0;
      text-align: left;
      padding: 5px;
    }
    .first-spinner{
      position: absolute;
      top: 50px;
      left: 20px;
    }
    .download-div-left{
      height: 30px;
      widhth: 150px;
      position: absolute;
      top: 50px;
      left: 60px;
      .area-list-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      }
    }
    .second-spinner{
      position: absolute;
      top: 50px;
      left: calc(50% - 40px);
    }
    .second-spinner-mobile{
      @extend .second-spinner;
      top: 100px;
      left: 20px;
    }
    .download-div-right{
      height: 30px;
      widhth: 150px;
      position: absolute;
      top: 50px;
      left: 50%;
      .posting-report-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      }
    }
    .download-div-right-mobile{
      @extend .download-div-right;
      top: 100px;
      left: 60px;
    }
  }

  .area-info-download-div-mobile{
    @extend .area-info-download-div;
    height: 160px;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
  }


  .payment-info-download-div{
    @extend .ui-row;
    width: calc(100% - 40px);
    height: 100px;
    margin: 20px;
    .payment-info-download-div-header{
      border-bottom:1px solid #777777;
      position: absolute;
      height: 30px;
      width: 100%;
      top: 0;
      left: 0;
      text-align: left;
      padding: 5px;
    }
    .first-spinner{
      position: absolute;
      top: 50px;
      left: 20px;
    }
    .download-div-left{
      height: 30px;
      widhth: 150px;
      position: absolute;
      top: 50px;
      left: 60px;
      .estimation-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      }
    }
    .second-spinner{
      position: absolute;
      top: 50px;
      left: calc(50% - 40px);
    }
    .download-div-right{
      height: 30px;
      widhth: 150px;
      position: absolute;
      top: 50px;
      left: 50%;
      .invoice-download{
        height: 100%;
        width: 100%;
        border: none;
        background-color: #2c50a0;
        color: white;

        &:hover {
          background-color: #213f81;
        }
        padding: .2em .4em;
        border-radius: .2em;
      }
    }
  }

  .payment-info-download-div-mobile{
    @extend .payment-info-download-div;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
  }
}

</style>