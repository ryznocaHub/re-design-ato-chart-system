import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'popper.js'
import 'bootstrap'
import './assets/custom.scss'
import '../public/tes.css'
import Vuex from "vuex"

import {BIconCircleFill, BIconPlusSquareFill,BIconCheck2Square, BIconX, BIconXCircleFill, BIconXSquare} from "bootstrap-icons-vue"

createApp(App).use(store).use(router).use(Vuex).mount('#app')

