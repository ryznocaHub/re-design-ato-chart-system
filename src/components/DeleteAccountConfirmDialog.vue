<template>
  <DialogFrameMini :state-store="deleteAccountConfirmDialogStateStore"
                   :dialog-height="device.mobile? 23 : 150">
    <template v-slot:dialogContent>
      <div
          :class="device.mobile ? 'container-fluid-mobile' : 'container-fluid'">
        <div class="message-row align-items-center"
             :class="device.mobile ? '' : 'row'">

          <div class="col text-center">{{ confirmMessage }}</div>
        </div>
        <div class="row justify-content-center pt-3">
          <button class="col-4 blank-button m-3"
                  @click="onClickCancel()">キャンセル</button>
          <button class="col-4 m-3 orange-button"
                  @click="onClickConfirm()">{{ affirmativeText }}</button>
        </div>
      </div>
    </template>
  </DialogFrameMini>
</template>

<script>
import backendApi from "@/apis/backend-api"
import DialogFrameMini from "./DialogFrameMini";
import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//const device = {mobile: true};

export default {
  name: "DeleteAccountConfirmDialog",
  components: {DialogFrameMini},
  props: {
    deleteAccountConfirmDialogStateStore: Object,
    confirmMessage: {
      type: String,
      default: "よろしいですか？"
    },
    affirmativeText: {
      type: String,
      default: "OK"
    },
    affirmativeFunc: Function,
    cancelFunc: Function,
  },
  data() {
    return {
      device,
    }
  },
  methods: {
    // かならずすべての処理を終えてから、isVisibleをfalseにすること　2022-01-23
    onClickConfirm() {
      console.log("onClickConfirm");
      this.affirmativeFunc();
      this.deleteAccountConfirmDialogStateStore.onContinue = true;
      this.deleteAccountConfirmDialogStateStore.isVisible = false;

    },
    onClickCancel() {
      console.log("onClickCancel");
      if (typeof this.cancelFunc === "function") {
        this.cancelFunc();
      }
      this.deleteAccountConfirmDialogStateStore.onContinue = false;
      this.deleteAccountConfirmDialogStateStore.isVisible = false;
    }
  }
}
</script>

<style scoped lang="scss">

$deep-gray: #777;

.container-fluid {

  .message-row {
    background-color: dimgray;
    color: white;
    height: 50px;
    font-size: 21px;


  }



  button {
    border-radius: 5px;
    height: 36px;
    font-size: 14px;
  }

  .orange-button {
    background-color: #e98801;
    border: none;
    color: white;

    &
    :hover {
      background-color: chocolate;
    }

    &
    :active {
      background-color: saddlebrown;
    }

  }

  .blank-button {

    color: $deep-gray;
    background-color: transparent;
    border: solid 1px $deep-gray;

    &
    :hover {
      background-color: $deep-gray;
      color: white;
    }

  }
}


.container-fluid-mobile {
  .message-row {
    background-color: dimgray;
    color: white;
    width: 90vw;
    height: 7vw;
    line-height: 7vw;
    font-size: 4vw;
    /* border-radius: 1.666vw;*/
  }


  button {
    height: 8vw;
    font-size: 3vw;
    border-radius: 1.666vw;
  }

  .orange-button {
    background-color: darkorange;
    border: none;
    color: white;

    &
    :hover {
      background-color: chocolate;
    }

    &
    :active {
      background-color: saddlebrown;
    }

  }

  .blank-button {

    color: $deep-gray;
    background-color: transparent;
    border: solid 1px $deep-gray;

    &
    :hover {
      background-color: $deep-gray;
      color: white;
    }

  }
}

</style>