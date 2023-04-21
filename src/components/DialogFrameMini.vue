<template>
    <transition name="fade">
        <div v-if="stateStore.isVisible"
             :class="device.mobile ? 'dialog-overlay-mobile' : 'dialog-overlay'"
             @click="stateStore.isVisible = false">
            <div class="dialog"
                 :class="{'dialog-lg': dialogSize === 'lg'}"
                 :style="{height: dialogHeight + currentUnit}"
                 @click="onMouseDownInDialog">
                <div v-if="!hideCloseButton && !device.mobile"
                     class="close-button"
                     @click="onClickClose">
                    <p class="h5">
                        <BIconXSquare/>
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

import {BIconXSquare} from "bootstrap-icons-vue"

import { createDeviceDetector } from "next-vue-device-detector";
const device = createDeviceDetector()
//const device = {mobile: true};
const currentUnit = device.mobile ? "vw" : "px"

export default {
    name: "DialogFrameMini",
    components: {
        BIconXSquare
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
        }
    },
    data(){
        return {
          device,
          currentUnit,
        }
    },
    methods: {
        onMouseDownInDialog(ev) {
            ev.stopPropagation()
        },
        onClickClose() {
            this.stateStore.isVisible = false
        },
        close() {
            this.stateStore.isVisible = false
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
                top: 10px;
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
       /* background-color: rgba(200, 200, 200, 0.5); */
        background-color: rgba(180, 180, 180, 0.7);
        z-index: 100;

      .dialog {
        position: fixed;
        top: 20vw;
        left: 0;
        bottom: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 90vw;
        height: auto;
       /* background-color: #eeeeee; */
        background-color: white;
       /* border-radius: 1.666vw;*/
        box-shadow: 2px 2px 5px rgba(100, 100, 100, 0.5);

      .close-button {
        position: absolute;
        right: 3.333vw;
        top: 3.333vw;
        width: 5vw;
        height: 5vw;
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
          width: calc(100vw - #{$dialog-margin-mobile} * 2);
          height: 140vw;
        }


    }
</style>
