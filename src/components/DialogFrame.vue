<template>
    <transition name="fade">
        <div v-if="stateStore.isVisible"
             :class="device.mobile ? 'dialog-overlay-mobile' : 'dialog-overlay'"
             @click="stateStore.isVisible = false">
            <div class="dialog"
                 :class="{'dialog-lg': dialogSize === 'lg'}"
                 :style="device.mobile ? '' : {height: dialogHeight + 'px'}"
                 @click="onMouseDownInDialog">
                <div v-if="!hideCloseButton"
                     class="close-button"
                     @click="onClickClose">
                    <p v-if="!iconTypeCircle" class="h5">
                        <BIconXSquare/>
                    </p>
                    <p class="icon-close-button" v-if="iconTypeCircle" style="color:white">
                        <BIconXCircleFill/>
                    </p>
                </div>
                <div class="dialog-content">
                    <slot name="dialogContent"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {BIconX} from "bootstrap-icons-vue"
import {BIconCircleFill} from "bootstrap-icons-vue"
import {BIconXSquare} from "bootstrap-icons-vue"
import {BIconXCircleFill} from "bootstrap-icons-vue"

import { createDeviceDetector } from "next-vue-device-detector";
import {functionStore} from "../store/function-store";
const device = createDeviceDetector()
//const device = {mobile: true};
const currentUnit = device.mobile ? "vw" : "px"



export default {
    name: "DialogFrame",
    components: {
        BIconXSquare,
        BIconX,
        BIconXCircleFill,
        BIconCircleFill,
    },
    props: {
        stateStore: Object,
        dialogSize: String,
        dialogHeight: {
            type: Number,
            default: 300,
        },
        hideCloseButton: {
            type: Boolean,
            default: false,
        },
        iconTypeCircle: {
          type: Boolean,
          default: false,
        }
    },
    data(){
        return {
          device,
          currentUnit,
          functionStore,
        }
    },
    methods: {
        onMouseDownInDialog(ev) {
            ev.stopPropagation()
        },
        onClickClose() {
            this.stateStore.isVisible = false
          const  disableScroll = this.functionStore.getters.preventScrollFunction;
          document.removeEventListener('touchmove',disableScroll,{ passive: false });
        },
        close() {
            this.stateStore.isVisible = false
          const  disableScroll = this.functionStore.getters.preventScrollFunction;
          document.removeEventListener('touchmove',disableScroll,{ passive: false });
        }
    }
}
</script>

<style scoped lang="scss">

    .fade-enter-active,
    .fade-leave-active {
        /* 表示されている際のCSSはこのブロックに記述 */
        transition: opacity 0.3s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        /* 非表示の際のCSSはこのブロックに記述 */
        opacity: 0;
    }

    $dialog-margin: 100px;
    $dialog-margin-mobile: 2vw;

    .dialog-overlay {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(200, 200, 200, 0.5);
        z-index: 100;

        .dialog {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 600px;
            background-color: #eeeeee;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(100, 100, 100, 0.5);

            .close-button {
                position: absolute;
                right: 10px;
                top: 0px;
                width: 30px;
                height: 30px;
                z-index: 2000;
                &:hover {
                    opacity: 0.7;
                }

                &:active {
                    opacity: 0.3;
                }
            }

            .dialog-content {
                position: relative;
            }


        }

        .dialog-lg {
            width: calc(100vw - #{$dialog-margin} * 2);
            height: 500px;
        }


    }



    .dialog-overlay-mobile {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      /*  background-color: rgba(200, 200, 200, 0.5);*/
        background-color: rgba(180, 180, 180, 0.7);
        z-index: 100;

      .dialog {
        position: fixed;
        top: 2vw;
        bottom: 15vw !important;
        left:1.5vw;
        right:1.5vw;
        width: 97vw;
       /* background-color: #eeeeee; */
        background-color: white;
        border-radius: 1.666vw;
        box-shadow: 2px 2px 5px rgba(100, 100, 100, 0.5);

      .close-button {
        position: absolute;
        right: 2.0vw;
        top: 0.7vw;
        width: 8vw;
        height: 7vw;
        z-index: 2000;
        .icon-close-button{
            position: relative;
            top:0;
            left:-0.23vw;
            width: 7vw;
            height: 7vw;
            font-size: 6vw;
          z-index: 2001;
        }

         &:hover {
           opacity: 0.7;
         }

        &:active {
           opacity: 0.3;
         }
        }

        .dialog-content {
          position: absolute;
          top:0;
          right:0;
          bottom:0;
          left:0;
        }


        }

        .dialog-lg {
          width: calc(100vw - #{$dialog-margin-mobile} * 2);
         /* height: 140vw;*/
        }


    }
</style>
