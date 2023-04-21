<template>
    <DialogFrame :state-store="disclaimerDialogStateStore"
                 :dialog-height="getDialogHeight()"
                 :hide-close-button="true"
                 ref="dialogFrame">
        <template v-slot:dialogContent>
            <div :class="device.mobile ? 'content-mobile' : 'content'">
                <h3 class="text-center dialog-header">免責事項</h3>
                <div class="update-limit-frame">
                    <div class="update-limit-label">承認済み商品</div>
                    <div class="update-limit-text">{{this.cartStore.getters.activeCartCount}}件</div>
                </div>
                <div class="disclaimer-text a_r">
                    <h5 class="a_r">配布エリア、部数、スケジュールについて</h5>
                    <p class="important-red a_r">エリア選択時に表示される配布部数は、当サービス独自の配布部数を示しており、選択エリアの全世帯への配布を保証するものではありません。</p>
                    <p class="a_r">町丁目ごとの配布部数は、概算のため実際とは異なる可能性がございます。</p>
                    <p class="a_r">配布先居住者のご意向による配布拒否、区画整理、住宅事情の変化、配布員確保、交通事情、天災・天候不良等の諸事情により選択エリア内の実配布数が配布見込数を下回った場合又は配布出来ないエリアが生じた場合、残数は、選択エリア近隣に配布されます。</p>
                    <p class="a_r">単独の配布ではなく他社広告物と併せて配布を行います。情報誌への挟み込み、丁合を行う場合があります。</p>
                    <p class="a_r">選択された配布完了希望日どおりの配布をお約束することはできかねます。実際の完了予定日は、入稿データの審査後にご連絡致します。</p>
                    <p class="a_r">配布開始日及び配布期間の指定、配布日毎の配布数の指定はできかねます。</p>
                    <p class="a_r">配布期間中、全日程での配布を保証するものではありません。</p>
                    <p class="a_r">配布完了希望日以前に配布が完了する場合があります。</p>
                    <p class="a_r">配布先住民のご意向による配布拒否、区画整理、住宅事情の変化、配布員確保、交通事情、天災・天候不良等の諸事情により、完了予定日までに配布完了できない場合、実配布数での精算又は期間延長しての配布とさせていただきます。</p>
                    <p class="last-line a_r">お客様によるデータ入稿・修正・校了の確認ならびに、入金の遅延が発生した場合、完了予定日までの配布ができない場合がございます。お早目に各作業をお願い致します。</p>

                    <h5 class="a_r">入稿データの審査について</h5>
                    <p class="a_r">以下の場合、お断りする場合があります</p>
                    <ul class="a_r">
                        <li class="a_r">住所や会社名、連絡先等記載がないもの</li>
                        <li class="a_r">法令、または公序良俗に反するもの</li>
                        <li class="a_r">各業界の広告ガイドラインに沿っていないもの</li>
                        <li class="a_r">内容が不明確なもの</li>
                        <li class="a_r">虚偽、誤認の恐れがあるもの</li>
                        <li class="a_r">意見広告</li>
                        <li class="a_r">その他弊社、各ポスティング会社が不適切と判断したもの</li>
                    </ul>
                    <p class="a_r">入稿データの審査があり、入稿データの内容によっては配布できかねる場合もございます。また、審査には数営業日を要する場合がございます。</p>
                    <p class="a_r">審査の結果によっては、ご希望のエリアに配布できない場合や配布完了日が後ろ倒しになる可能性がございます。配布日に変更があった場合は審査後にお知らせします。</p>
                    <p class="last-line a_r">審査中は印刷データを差し替えることはできかねます。</p>
                    <h5 class="a_r">その他注意事項</h5>
                    <p class="a_r">入稿データの審査後のキャンセルは、全額をキャンセル料として頂戴致します。</p>
                    <p class="a_r">配布完了希望日によって価格は変動しますのでご注意ください。（例：8/1時点の配布完了希望日8/9と、8/5時点の配布完了希望日8/9の価格は異なります。）</p>
                    <p class="a_r">地図から部数を設定できないエリアがございます。その場合はお問い合わせフォームよりご依頼ください。</p>
                    <p class="a_r">反響を保証するものではありません。</p>
                    <p class="a_r">配布会社判断で投函禁止の基準を設けておりますが、投函禁止の表記によっては投函する場合があります。投函先対応にてお困りの際は当社までご連絡下さい。</p>
                </div>
                <p class="text-center note-text">上記、注意事項を了承後、「注文確定」ボタンを押してください</p>
                <div class="button-container">
                    <button class="left-button blank-button"
                            @click="onClickCancel">キャンセル</button>
                    <button class="orange-button right-button"
                            @click="onClickPutInCart">注文確定</button>
                </div>
            </div>
        </template>
    </DialogFrame>
</template>

<script>
import DialogFrame from "./DialogFrame";
import {cartStore} from "../store/cart-store";

import { createDeviceDetector } from "next-vue-device-detector";
import {functionStore} from "../store/function-store";
const device = createDeviceDetector()
//const device = {mobile: true};
const  screenAvailableHeight = window.screen.availHeight * 1.5; //謎


export default {
    name: "DisclaimerDialog",
    components: {
        DialogFrame
    },
    props: {
        disclaimerDialogStateStore: Object,
        onDisclaimerAccepted: {
            type: Function,
            default: () => {
                console.warn("DisclaimerDialog onDisclaimerAccepted not implemented!")
            }
        }
    },
      data() {
        return {
          device,
          screenAvailableHeight,
          functionStore,
          cartStore,
        }
      },
    methods: {
        getDialogHeight(){
          if(! device.mobile){
            return 600;

          }else{
            return screenAvailableHeight;
          }
        },
        getExpBoxHeight(){
          if(! device.mobile){
            return "";
          }else{
            return 'height:' + screenAvailableHeight * 0.5 + 'px'
          }
        },
        onClickPutInCart() {
            this.disclaimerDialogStateStore.isVisible = false;
            this.onDisclaimerAccepted();
            const  disableScroll = this.functionStore.getters.preventScrollFunction;
            document.removeEventListener('touchmove',disableScroll,{ passive: false });
        },
        onClickCancel() {
            this.disclaimerDialogStateStore.isVisible = false;
            const  disableScroll = this.functionStore.getters.preventScrollFunction;
            document.removeEventListener('touchmove',disableScroll,{ passive: false });
        },
   /*     updateLimitDateString() {
            const limitDate = estimationStore.state.estimation.uploadLimitDate
            if (limitDate) {
                return limitDate.format("M月D日 HH:mm")
            }
            return "-月-日 --:--"
        }*/
    },
}
</script>





<style scoped lang="scss">

$deep-gray: #777;

.content {
  background-color: #eeeeee;

.dialog-header {
  background-color: dimgray;
  color: white;
  height: 50px;
  width: 100%;
  font-size: 21px;
  line-height: 50px;
}

.update-limit-frame {
  width: 400px;
  height: 40px;
  display: flex;
  position: relative;
  left: 0;
  right: 0;
  margin: 20px auto;
  background-color: white;
  font-size: 16px;
  font-weight: bold;

.update-limit-label {
  background-color: #333333;
  width: 50%;
  height: 100%;
  color: white;
  text-align: center;
  line-height: 40px;
}

.update-limit-text {
  width: 50%;
  height: 100%;
  text-align: center;
  line-height: 40px;
}
}

.disclaimer-text {
  background-color: rgba(255, 255, 255, 0.9);
  width: calc(100% - 60px);
  height: 340px;
  margin-left: 30px;
  margin-right: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-bottom: 5px;
  padding: 20px 30px;
  .a_r{
    text-align: start;
  }

p {
  margin-bottom: 20px;
}

.important-red {
  color: red;
}

h5 {
  margin-top: 40px;
  margin-bottom: 1rem;

&:first-of-type {
    margin-top: 0;
  }
}
}

.note-text {
  margin-top: 30px;
  font-size: 14px;
  color: #333333;
  margin-bottom: 10px;
}

.button-container {
  position: relative;
  display: flex;
  height: 40px;
  width: 300px;
  left: 0;
  right: 0;
  margin: 20px auto;

button {
  border-radius: 5px;
  width: 130px;
  height: 40px;
}

.orange-button {
  background-color: #e98801;
  border: none;
  color: white;

&:hover {
    background-color: chocolate;
  }

&:active {
    background-color: saddlebrown;
  }
}

.left-button {
  left: 0;
  margin-right: 40px;
}

.right-button {
  right: 0;
}

.blank-button {
  color: $deep-gray;
  background-color: transparent;
  border: solid 1px $deep-gray;

&:hover {
    background-color: $deep-gray;
    color: white;
  }
}
}
}







.content-mobile {
  position: absolute;
  top:0;
  left:0;
  bottom:2vw;
  right:0;
  background-color: #eeeeee;
 // width:100%;
 // height:100%;


.dialog-header {
  position:absolute;
  top:0;
  left:0;
  background-color: dimgray;
  color: white;
  height: 7vw;
  width: 100%;
  font-size: 4vw;
  line-height: 7vw;
}

.update-limit-frame {
//  width: 60vw;
  height: 8vw;
  display: flex;
  position: absolute;
  top: 10vw;
  left: 20vw;
  right: 20vw;

  background-color: white;
  font-size: 4vw;
  font-weight: bold;

.update-limit-label {
  background-color: #333333;
  width: 50%;
  height: 100%;
  color: white;
  text-align: center;
  line-height: 8vw;
}

.update-limit-text {
  width: 50%;
  height: 100%;
  text-align: center;
  line-height: 8vw;
}
}

.disclaimer-text {
  background-color: rgba(255, 255, 255, 0.9);
  //width: calc(100% - 60px);
  position:absolute;
  top: 25vw;
  left: 1vw;
  right: 1vw;
  bottom: 30vw;
  //height: 60vw;
  font-size: 3vw;
  //margin-left: 30px;
  //margin-right: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  //margin-bottom: 5px;
  padding: 20px 30px;

p {
  margin-bottom: 20px;
}

.important-red {
  color: red;
}

h5 {
  margin-top: 6vw;
  margin-bottom: 2vw;
  font-size: 4vw;

&:first-of-type {
    margin-top: 0;
  }
}
}

.note-text {
  position:absolute;
  bottom: 20vw;
  width: 100%;
  text-align: center;
  font-size:  3vw;
  color: #333333;

}

.button-container {
  position: absolute;
  display: flex;
  height: 20vw;
 // width:  95vw;
  bottom:0;
  left: 2vw;
  right: 2vw;

 // left: 0;
 // right: 0;
 // margin: 20px auto;

button {
  position: absolute;
  bottom: 3.555vw !important;
  border-radius: 1.6vw;
  width: 45%;
  height: 11vw;
  margin: auto;
  font-size: 4vw;
}

.orange-button {
  background-color: darkorange;
  border: none;
  color: white;

&:hover {
    background-color: chocolate;
  }

&:active {
    background-color: saddlebrown;
  }
}

.left-button {
  left: 0;
  margin-right: 40px;
}

.right-button {
  right: 0;
}

.blank-button {
  color: $deep-gray;
  background-color: transparent;
  border: solid 1px $deep-gray;

&:hover {
    background-color: $deep-gray;
    color: white;
  }
}
}
}

</style>