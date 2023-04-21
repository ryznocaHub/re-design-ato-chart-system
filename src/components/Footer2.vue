<template>
    <div class="footer row justify-content-center mx-0"
    :class="relative ? 'footer-relative':'footer'">
      <div class="col text-center">Ⓒ 株式会社アト 2022</div>
    </div>

    <div class="modal" id="generic_modal_confirm_with_args">
      <a href="javascript:void(0)" class="modal-overlay" aria-label="Close" @click="genericModalWithArgsClose()"></a>
      <div class="modal-container">
        <div class="modal-body">
          <div class="content">
            <img class="img-modal" alt="image modal" src="../assets/img/Delete.png" >
            <div><b id="generic_modal_with_args_title"></b></div>
            <p id="generic_modal_with_args_message" lang="ja"></p>
          </div>
        </div>
        <div class="modal-footer">
          <section  id="generic_modal_with_args_footer"  class="columns">
            <div  class="modal_footer column col-12"><button class="modal-confirm-btn" @click="modalOkExecuteWithArgs()">確定する</button><button class="modal-cancel-btn" @click="genericModalWithArgsClose()">キャンセル</button></div>
          </section>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  
  import {functionStore} from "../store/function-store";
  
  
  export default {
    name: "Footer",
    props: {
      relative: Boolean
    },
    data(){
      return{
        functionStore,
      }
    },
    methods:{
      genericAlertClose(){
        let modalEle = document.getElementById("generic_alert");
        modalEle.classList.remove("active");
      },
      genericModalClose(){
        let modalEle = document.getElementById("generic_modal_confirm");
        modalEle.classList.remove("active");
      },
      modalOkExecute(){
          const modalOkExecute = this.functionStore.getters.modalOkExecute
          modalOkExecute()
          this.genericModalClose()
      },
      genericModalWithArgsClose(){
        let modalEle = document.getElementById("generic_modal_confirm_with_args");
        modalEle.classList.remove("active");
      },
      modalOkExecuteWithArgs(){
        const modalOkExecuteWithArgs = this.functionStore.getters.modalOkExecuteWithArgs
        const modalArgs      = this.functionStore.getters.modalArgs
        modalOkExecuteWithArgs(modalArgs)
        this.genericModalWithArgsClose()
      }
    }
  }
  </script>
  
  <style scoped>
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: darkorange;
    line-height: 50px;
    color: white;
  }
  
  .footer-relative {
    position: relative;
    bottom: 0;
    width: 100%;
    background: darkorange;
    line-height: 50px;
    color: white;
  }
  
  </style>