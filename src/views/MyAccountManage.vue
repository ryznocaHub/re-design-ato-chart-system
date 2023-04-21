<template>
  <Header msg=""/>
  <h4 class="page-title">マイアカウントの管理</h4>

  <div class="all-content">
    <div :class="editingStatus() ? 'editing' : 'container-wrap'">
      <div class="container-header">
        <div class="header">ユーザー名、所属の編集</div>
        <div class="container-button">
          <button v-if="editingStatus()" class="button-secondary" @click="cancelBtn()" >キャンセル</button>
          <button v-if="editingStatus()" class="button-primary" @click="saveMyAccountInfo()">保存</button>
          <button v-if="!editingStatus()" class="button-secondary" @click="editBtn()">編集</button>
        </div>
      </div>
  
      <div class="label">User_name</div>
      <div id="user-id" class="item" >{{myAccount().user_id}}</div>
  
      <div class="label">User_ID</div>
      <div id="user-name" class="item" :contenteditable="editingStatus()">{{myAccount().user_name}}</div>
  
      <div class="label">Department</div>
      <div id="department" class="item" :contenteditable="editingStatus()">{{myAccount().department}}</div>
  
      <div class="label">Authority</div>
      <div class="item" >
        <select id="privilege-selecter"  :disabled="true">
          <option value="1" :selected="myAccount().privilege === 1">スタッフ</option>
          <option value="2" :selected="myAccount().privilege === 2">管理者</option>
          <option value="3" :selected="myAccount().privilege === 3">SuperAdmin</option>
        </select>
      </div>
      
    </div>
  
    <div :class="editingAddressStatus() ? 'editing' : 'container-wrap'">
      <div class="container-header">
        <div class="header">マップアクセス時の初期表示アドレスの編集</div>
        <div class="container-button">
          <button v-if="editingAddressStatus()" class="button-secondary" @click="cancelAddressBtn()">キャンセル</button>
          <button v-if="editingAddressStatus()" class="button-primary" @click="saveMyAccountFirstAddress()">保存</button>
          <button v-if="!editingAddressStatus()" class="button-secondary" @click="editAddressBtn()">編集</button>
        </div>
      </div>
      <div id="first-address" class="item" :contenteditable="editingAddressStatus()">{{myAccountAddress()}}</div>
    </div>
  
    <div :class="editingPasswordStatus() ? 'editing' : 'container-wrap'">
      <div class="container-header">
        <div class="header">パスワードの変更</div>
        <div class="container-button">
          <button v-if="editingPasswordStatus()" class="button-secondary" @click="cancelPasswordBtn()" >キャンセル</button>
          <button v-if="editingPasswordStatus()" class="button-primary" @click="renewMyAccountPassword()">保存</button>
          <button v-if="!editingPasswordStatus()" class="button-secondary" @click="editPasswordBtn()">変更</button>
        </div>
      </div>
  
      <div id="password1" class="item" :contenteditable="editingPasswordStatus()">*******</div>
      <div id="password2" class="item" :contenteditable="editingPasswordStatus()">*******</div>
      
    </div>
  </div>

  <Footer/>

</template>

/*このページでの想定は、変更はuser_id, user_name passwor の3種類となる*/
<script>
import Header from '@/components/Header'
import backendApi from "@/apis/backend-api";
import Footer from "../components/Footer";
import {accountStore} from "../store/account-store";
import {DialogFrameStateStore} from "../components/dialog-frame-state-store";
export default {
  name: "MyAccountManage",
  components: {
    Header,
    Footer,
  },
  data(){
    return {
      accountStore,
      editing : false,
      editingAddress: false,
      editingPassword: false,
    }
  },
  async beforeMount(){
    const myAccount = await backendApi.myAccountInfo()
    if (myAccount.result == 'success'){
      this.accountStore.commit("updateMyAccount",myAccount.value)
    }

  },


  /*
  * function genericAlertClose(){
    let modalEle = document.getElementById("generic_alert");
    modalEle.classList.remove("active");
}
function genericAlertOpen(title,message){
    document.getElementById("generic_alert_title").innerText = title;
    document.getElementById("generic_alert_message").innerText = message;
    let modalEle = document.getElementById("generic_alert");
    modalEle.classList.add("active");
}
  * */
  methods:{
    
    genericAlertOpen(title,message){
      document.getElementById("generic_alert_title").innerText = title;
      document.getElementById("generic_alert_message").innerText = message;
      let modalEle = document.getElementById("generic_alert");
      modalEle.classList.add("active");
    },
    editingStatus(){
      return this.editing
    },
    editingAddressStatus(){
      return this.editingAddress
    },
    editingPasswordStatus(){
      return this.editingPassword
    },
    myAccount(){
      return this.accountStore.getters.myAccount
    },
    myAccountAddress(){
      if(this.accountStore.getters.myAccount.first_address){
        return this.accountStore.getters.myAccount.first_address
      }else{
        return this.accountStore.getters.myAccount.company_address
      }
    },
    editBtn(){
      this.initStatus()
      this.editing = true
    },
    editAddressBtn(){
      this.initStatus()
      this.editingAddress = true
    },
    editPasswordBtn(){
      this.initStatus()
      this.editingPassword = true
    },
    initStatus() {
      this.editing = false
      this.editingAddress = false
      this.editingPassword = false
    },
    saveBtn(){

    },
    cancelBtn(){
      this.editing = false
    },
    cancelAddressBtn(){
      this.editingAddress = false
    },
    cancelPasswordBtn(){
      this.editingPassword = false
    },
    debug(){
     // alert(JSON.stringify(this.accountStore.getters.myAccount))


    },
    async saveMyAccountInfo(){
      //const userId =  document.getElementById("user-id").innerText
      const userName = document.getElementById("user-name").innerText
      const department = document.getElementById("department").innerText

      let myAccountInfo = {}
    //  myAccountInfo.user_id = userId
      myAccountInfo.user_name = userName
      myAccountInfo.department = department

     const returnData = await backendApi.myAccountInfoUpdate(myAccountInfo)
      if (returnData.result == "success"){
        this.accountStore.commit("updateMyAccount",returnData.value)
       // alert("アカウント情報が更新されました。")
        this.genericAlertOpen("アカウント情報更新","アカウント情報が正常の更新されました。")
      }else{
        this.genericAlertOpen("アカウント情報更新","アカウント情報の更新に失敗しました。")
        //alert("アカウント情報の更新に失敗しました。")
      }
      this.editing = false
    },
    async saveMyAccountFirstAddress(){
      const firstAddress = document.getElementById("first-address").innerText
      let myAccountFirstAddress = {}
      myAccountFirstAddress.first_address = firstAddress

      const returnData = await backendApi.myAccountFirstAddressUpdate(myAccountFirstAddress)

      if (returnData.result == "success"){
        this.accountStore.commit("updateMyAccount",returnData.value)
        this.genericAlertOpen("初期表示アドレス更新","マップ初期表示アドレスが変更されました。")
         // alert("マップ初期表示アドレスが変更されました。")
      }else{
        　//alert("マップ初期表示アドレスの変更に失敗しました。")
        this.genericAlertOpen("初期表示アドレス更新","マップ初期表示アドレスの変更に失敗しました。")
      }

      this.editingAddress = false

    },
    async renewMyAccountPassword(){
      const password1 = document.getElementById("password1").innerText
      const password2 = document.getElementById("password2").innerText

      let renewPassword = {}
      renewPassword.password1 = password1
      renewPassword.password2 = password2

      if(password1 == password2 && password1.length > 7 && password1.match(/^[\x20-\x7e]+$/)){

            const returnData = await backendApi.myAccountPasswordUpdate(renewPassword)

            if(returnData.result == "success"){
              this.genericAlertOpen("パスワード設定","passwordの再設定が完了しました。")
            }else{
              this.genericAlertOpen("パスワード設定","passwordの再設定に失敗しました。")
            }
      }else{
        this.editingPassword = false
        if(password1 != password2){
          this.genericAlertOpen("パスワード設定","パスワードと確認用パスワードが一致しません")
          return
        }
        if(password1.length <= 7){
          this.genericAlertOpen("パスワード設定","パスワードは、8文字以上の半角英数字記号である必要があります。")
          return
        }
        if(! password1.match(/^[\x20-\x7e]+$/)){
          this.genericAlertOpen("パスワード設定","パスワードは、8文字以上の半角英数字記号である必要があります。")
          return
        }
      }
      this.editingPassword = false
    }
  }
}
</script>

<style scoped lang="scss">
.all-content{
  height: 90vh;
  overflow: auto;
  padding-bottom: 150px;
}
$base-color: #FF8C00;
$sec-color: #FFE6C7;
.page-title{
  font-weight: 900;
  margin-top: 20px;
  margin-bottom: 40px;
}
select {
  -webkit-appearance: none;
  appearance: none; /* デフォルトのスタイルを無効 */

  &::-ms-expand {
    display: none;
  }
}

.container-wrap{
  border: 1px solid $base-color;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 0px 10%;
  text-align: start;
  margin-bottom: 20px;
  .container-header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .header{
      font-weight: 900;
      font-size: 20px;
    }
    .container-button{
      display: flex;
      justify-content: end;
      .button{
        padding: 5px 10px;
        margin-left: 20px;
        border-radius: 5px;
        white-space: nowrap;
        &:hover{
          background-color: $sec-color;
        }
      }
      .button-primary {
        @extend .button;
        border: 1px solid $base-color;
        background-color: $base-color;
        color: white;
        &:hover{
          color: $base-color;
          background-color: $sec-color;
        }
      }
      .button-secondary {
        @extend .button;
        border: 1px solid $base-color;
        background-color: white;
        color: $base-color;
      }
    }
  }

  .label{
    font-weight: 900;
  }
  .item{
    margin-bottom: 15px;
  }
}

.editing {
  @extend .container-wrap;

  [contenteditable]{
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
}

.account-cell-wrap{
  overflow: scroll;
}

</style>