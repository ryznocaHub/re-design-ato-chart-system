<template>
  <Header msg=""/>

  <div class="all-content">
    <div :class="device.mobile ? 'container-wrap-mobile' : 'container-wrap'">
      <h4 class="page-title">アカウントの管理</h4>
      <div class="container-add">
        <div>アカウント管理表</div>
        <button class="add-account" @click="addBtn()">アカウントの追加</button>
      </div>
      <div class="container-content"  :class="device.mobile ? 'container-content-mobile' : null">
        <b class="cell-wide">User_ID</b>
        <b class="cell-wide">User_Name</b>
        <b class="cell">Department</b>
        <b class="cell">Authority</b>
        <b :class="device.mobile ? 'cell-wide' : 'cell'"></b>
      </div>
      <div v-if="addingStatus() || this.adding" class="container-content" :class="device.mobile ? 'container-content-mobile' : null">
        <div id="user-id-add" class="cell-wide editable" placeholder="E-MAIL"  contenteditable></div>
        <div id="user-name-add" class="cell-wide editable" placeholder="お名前" contenteditable></div>
        <div id="department-add" class="cell editable" placeholder="部門" contenteditable></div>
        <div class="cell" >
          <select id="privilege-add">
            <option value="1" selected>スタッフ</option>
            <option value="2" >管理者</option>
            <option value="3" >SuperAdmin</option>
          </select>
        </div>
        <div :class="device.mobile ? 'cell-wide' : 'cell'" class="button-container">
          <BIconX @click="cancelAddBtn()"  class="icon red" />
          <BIconCheck2 @click="addSaveBtn()" class="icon green" />
        </div>
      </div>
      
      <div :class="[editingStatus(account.id) ? 'editing' : 'container-content',device.mobile ? 'container-content-mobile' : null]"  v-for="(account, i) in getAccountList()" :key="i">
        <div :id="getUserIdId(account.id)" class="cell-wide"  :contenteditable="editingStatus(account.id)">{{account.user_id}}</div>
        <div :id="getUserNameId(account.id)" class="cell-wide" :contenteditable="editingStatus(account.id)">{{account.user_name}}</div>
        <div :id="getDepartmentId(account.id)" class="cell" :contenteditable="editingStatus(account.id)">{{account.department}}</div>
        <div class="cell" >
          <select :id="getSelectedId(account.id)"  :disabled="!editingStatus(account.id)">
            <option value="1" :selected="account.privilege === 1">スタッフ</option>
            <option value="2" :selected="account.privilege === 2">管理者</option>
            <option value="3" :selected="account.privilege === 3">SuperAdmin</option>
          </select>
        </div>
        <div :class="device.mobile ? 'cell-wide' : 'cell'" class="button-container">
          <button @click="deleteBtn(account.id)" :class="editingStatus(account.id) ? 'not-show' : 'not-show'">{{account.etc1}}</button>
          <span v-if="editingStatus(account.id)" @click="saveBtn(account.id)" class="icon green"><BIconCheck2  /></span>
          <span @click="cancelBtn(account.id)" :class="editingStatus(account.id) ? null : 'not-show'"  class="icon red" ><BIconX /></span>
          <span @click="deleteBtn(account.id)" :class="editingStatus(account.id) ? null : 'not-show'"  class="icon white"><BIconTrash/></span>
          <span v-if="!editingStatus(account.id)" class="icon white" @click="editBtn(account.id)"><BIconPencil/></span> 
        </div>
      </div>
    </div>
  </div>
  
  <Footer/>

  <!-- <DeleteAccountConfirmDialog :delete-account-confirm-dialog-state-store="deleteAccountConfirmDialogStateStore"
                           :affirmative-func="deleteBtnTest"
                           :confirm-message="'アカウントを削除してよろしいですか？'"
                           :affirmative-text="'削除'"/> -->
</template>

<script>
import Header from '@/components/Header'
import backendApi from "@/apis/backend-api";
import Footer from "../components/Footer2";
import {accountStore} from "../store/account-store";
import {functionStore} from "../store/function-store";
import {DialogFrameStateStore} from "../components/dialog-frame-state-store";
import DeleteAccountConfirmDialog from "../components/DeleteAccountConfirmDialog";
import {BIconCheck2, BIconX, BIconTrash, BIconPencil} from "bootstrap-icons-vue"
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//import {allMenuStore} from "../store/all-menu-store";

let editingId = -1;
let editing = false;

let modalOkFunction;
function modalOkExecute(){
  modalOkFunction();
}
//let adding = false;
//let addingAccounts = []
export default {
  name: "AccountsManage",
  components: {
    Header,
    Footer,
    DeleteAccountConfirmDialog,
    BIconCheck2,
    BIconTrash,
    BIconX,
    BIconPencil
  },
  data(){
    return {
      accountStore,
      adding : false,
      deleteAccountConfirmDialogStateStore: new DialogFrameStateStore(),
      delteAccount: {},
      functionStore,
      device
    }
  },
  async beforeMount(){
    const respData = await backendApi.accountList()
    if(respData.result == "success"){
        accountStore.commit("updateAccountList",respData.value)
    }
  },
  methods: {
    genericModalOpenWithArgs(title,message,execute,args){
      console.log("title",title)
      console.log("message",message)
      console.log("execute",execute)
      console.log("args",args)
      this.functionStore.commit("updateModalOkExecuteWithArgs",execute)
      this.functionStore.commit("updateModalArgs",args)
      document.getElementById("generic_modal_with_args_title").innerText = title;
      document.getElementById("generic_modal_with_args_message").innerText = message;
      let modalEle = document.getElementById("generic_modal_confirm_with_args");
      modalEle.classList.add("active");
    },
    genericModalOpen(title,message,execute){
    //  modalOkFunction = execute;
      this.functionStore.commit("updateMadalOkExecute",execute)
      document.getElementById("generic_modal_title").innerText = title;
      document.getElementById("generic_modal_message").innerText = message;
      let modalEle = document.getElementById("generic_modal_confirm");
      modalEle.classList.add("active");
    },
    genericAlertOpen(title,message){
      document.getElementById("generic_alert_title").innerText = title;
      document.getElementById("generic_alert_message").innerText = message;
      let modalEle = document.getElementById("generic_alert");
      modalEle.classList.add("active");
    },
    handleClick: function (i) {
      this.selectedOption = i
      this.open = false
      this.$emit('change', this.options[i])
    },
    getAddingAccount(){
      return addingAccounts
    },
    getAccountList(){
      return accountStore.getters.accountList;
    },
    editBtn(id){
      //alert(id)
      this.initStatus()
      editing = true;
      editingId = id
      for(let i = 0; i < accountStore.getters.accountList.length;i++){
        if( accountStore.getters.accountList[i].id == id){
          accountStore.getters.accountList[i].etc1 = "削除"
          accountStore.getters.accountList[i].etc2 = "キャンセル"
        }
      }
      //accountStore.getters.accountList[0].company_name = accountStore.getters.accountList[0].company_name + "0"
     // let copy = JSON.parse(JSON.stringify(this.getAccountList()))
     // accountStore.commit("saveAccountList",JSON.parse(JSON.stringify(this.getAccountList())))
     // accountStore.commit("updateAccountList",[])
      //accountStore.commit("updateAccountList",copy)
    },
    async addSaveBtn(){
      let saveAccountData = {}
      saveAccountData.site_id = accountStore.getters.accountList[0].site_id
      saveAccountData.company_id = accountStore.getters.accountList[0].company_id
      const newUserId =  document.getElementById("user-id-add").innerText
      saveAccountData.user_id = newUserId

      const newUserName = document.getElementById("user-name-add").innerText
      saveAccountData.user_name = newUserName

      const newDepartment = document.getElementById("department-add").innerText
      saveAccountData.department = newDepartment

      const index = document.getElementById("privilege-add").selectedIndex
      const newPrivilege = document.getElementById("privilege-add").options[index].value
      saveAccountData.privilege = Number(newPrivilege)


      const respData = await backendApi.accountInsert(saveAccountData)

      if(respData.result === "success") {
        const respDataList = await backendApi.accountList()
        if (respDataList.result == "success") {
          accountStore.commit("updateAccountList", respDataList.value)
        }
      }

      this.initStatus()

      if(respData.result === "success"){
        this.genericAlertOpen("アカウントの追加","初期パスワードは:  " + respData.value + " " + "に設定されました。（一度しか表示されません。）" )
      }else{
        this.genericAlertOpen("アカウントの追加の失敗","アカウントの追加に失敗しました。")
      }





    },
    async saveBtn(id){
     this.initStatus()
      editing = false;
      editingId = -1;
      let saveAccountData = {}
      for(let i = 0; i < accountStore.getters.accountList.length;i++){
        if( accountStore.getters.accountList[i].id == id){
           saveAccountData = accountStore.getters.accountList[i]
        }
      }
      const newUserId =  document.getElementById("user-id-" + id).innerText
      saveAccountData.user_id = newUserId

      const newUserName = document.getElementById("user-name-" + id).innerText
      saveAccountData.user_name = newUserName

      const newDepartment = document.getElementById("department-" + id).innerText
      saveAccountData.department = newDepartment

      const index = document.getElementById("selected-" + id).selectedIndex
      const newPrivilege = document.getElementById("selected-" + id).options[index].value
      saveAccountData.privilege = Number(newPrivilege)

      const respData = await backendApi.accountUpdate(saveAccountData)

      if(respData.result = "success"){
        this.genericAlertOpen("アカウントの編集","アカウントの編集が正常の完了しました。")
      }else{
        this.genericAlertOpen("アカウントの編集","アカウントの編集に失敗しました。")
      }


      //alert(JSON.stringify(saveAccountData))

    },
    cancelBtn(id){
      this.initStatus()
    },
    initStatus(){
      this.adding = false
      editing = false
      editingId = -1
      for(let i = 0; i < accountStore.getters.accountList.length;i++){
        accountStore.getters.accountList[i].etc1 = ""
        accountStore.getters.accountList[i].etc2 = ""
      }
    },
    async deleteBtnTest(){
    // alert('delete_btn')
      const respData = await backendApi.accountDelete(this.deleteAccount)
      if (respData.result === 'success'){
         const respDataList = await backendApi.accountList()
        if(respDataList.result === "success"){
           accountStore.commit("updateAccountList",respDataList.value)
        }
      //  this.genericAlertOpen("アカウントの削除","アカウントの編集が正常の完了しました。")
      }else{
        this.genericAlertOpen("アカウントの削除","アカウントの削除の失敗しました。")
      }
    },
    deleteBtn(id){
      this.deleteAccount = {}
      for(let i = 0; i < accountStore.getters.accountList.length;i++){
          if(id === accountStore.getters.accountList[i].id){
              this.deleteAccount = accountStore.getters.accountList[i]
          }
      }

    //  this.deleteAccountConfirmDialogStateStore.isVisible = true

      this.genericModalOpenWithArgs("アカウントの削除",this.deleteAccount.user_id + "のアカウントを削除してよろしいですか？",this.deleteBtnTest)


     // alert(this.editingStatus(id))
      /* ここでアラートから、削除してよろしいですかのワーニングメッセージを出す */
    },
    editingStatus(id){
      if(!editing){
        return false
      }
      if(id != editingId){
        return false
      }
      return true
    },
    getUserIdId(id){
      return 'user-id-' + id
    },
    getShowPasswordId(id){
      return 'show-password-' + id
    },
    getUserNameId(id){
      return 'user-name-' + id
    },
    getDepartmentId(id){
      return 'department-' + id
    },
    getSelectedId(id){
      return 'selected-' + id
    },
    addBtn(){
      this.initStatus()
      this.adding = true;
     // alert(adding)
    },
    cancelAddBtn(){
      this.initStatus()
      this.adding = false;
    },
    addingStatus(){
      return this.adding;
    },

  }
}
</script>

<style scoped lang="scss">

$base-color: #FF8C00;
$sec-color: #FFE6C7;

.all-content{
  height: 90vh;
  overflow: auto;
  margin-bottom: 40px;
}
.container-wrap{
  text-align: start;
  padding: 10px 20%;
  margin-bottom: 50px;
  overflow: auto;
}

.container-wrap-mobile{
  @extend .container-wrap;
  padding: 10px 3%;
}

.page-title{
   margin-top: 20px;
   font-weight: 900;
 }
.container-add{
  display:flex;
  justify-content: space-between;
  align-items: center;
  background-color: $sec-color;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #595959;
  padding: 10px 20px;
  div {
    font-weight: 900;
  }
  button{
    background-color: $base-color;
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-weight: 900;
    margin-left: 20px;
    &:hover{
      background-color: $sec-color;
    }
  }
}

.button-container{
  display: flex;
  justify-content: end;
  .icon{
      font-size: 15px;
      padding: 3px 6px;
      border-radius: 50%;
      
      &:hover{
        cursor: pointer;
        background-color: white;
      }
    }
    .green {
      @extend .icon;
      background-color: #EEFFF3;
      border: 1px solid #23A047;
      color: #23A047;
    }
    .red {
      @extend .icon;
      background-color: #FFE9E9;
      border: 1px solid #CD0000;
      color: #CD0000;
    }
    .orange {
      @extend .icon;
      background-color: rgb(255, 243, 227);
      border: 1px solid $base-color;
      color: $base-color;
    }
    .white {
      @extend .icon;
      padding: 3px 6px;
      background-color: white;
      border: 1px solid $base-color;
      color: $base-color;
      &:hover {
        background-color: #fff4dc;
      }
    }
}

.button-container > * {
  margin-left: 10px;
}
.container-content{
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-wrap: ;
  width: 100%;
  padding: 5px 20px;
  background-color: white;
  .cell{
    border-radius: 5px;
    width: 15%;
    font-size: 12px;
    padding-right: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    button {
      background-color: $base-color;
      border-radius: 5px;
      padding: 5px 10px;
      color: white;
      font-weight: 900;
      margin-left: 5px;
      &:hover{
        background-color: $sec-color;
      }
    }
    .not-show{
      // background-color: none;   
      display: none;
      width: 200px;
    }

    
  }
  .cell-wide{
    @extend .cell;
    width: 25%;
  }
  .odd{
    background-color: #EBEBEB;
  }
  .editable{
    border: 1px solid lightgray;
    padding: 2px 5px;
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
    [placeholder]:empty::before {
      content: attr(placeholder);
      color: $base-color;
    }
    [placeholder]:empty:focus::before {
      content: "";
    }
  }
}
.container-content-mobile{
  width: 150%;
}
.editing{
  @extend .container-content; 
  [contenteditable]{
    padding: 5px;
    border: 1px solid lightgray;
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
}

</style>