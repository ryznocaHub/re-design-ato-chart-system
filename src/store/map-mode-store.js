import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate";

//mode は。plan to order があり一旦、plan または orderの場合は access_type=authorizerをつけることとする
//mode は　"", "plan_key" , "print_order_id" の3種類とする
const modePlanKey = "plan_key";
const modePrintOrderId = "print_order_id";
const modeOrderKey = "order_key"
const mapModeStore = new Vuex.Store({
    state: {
        mode: "",
        planKey: "",
        printOrderId: "",
        modeOkikomi :"",
        planKeyOrikomi: "",
        orderKeyOrikomi: ""
    },
    mutations:{
        updateMode(state,mode){
            state.mode = mode
        },
        updateModeOrikomi(state,modeOrikomi){
            state.modeOkikomi = modeOrikomi
        },
        updatePlanKey(state,planKey){
            state.mode = modePlanKey
            state.planKey = planKey
        },
        updatePlanKeyOrikomi(state,planKeyOrikomi){
            state.modeOrikomi = modePlanKey
            state.planKeyOrikomi = planKeyOrikomi
        },
        updatePrintOrderId(state,printOrderId){
            state.mode= modePrintOrderId
            state.printOrderId = printOrderId
        },
        updateOrderKeyOrikomi(state,orderKeyOrikomi){
            state.modeOrikomi = modeOrderKey
            state.orderKeyOrikomi = orderKeyOrikomi
        },
        clearMode(state){
            state.mode = ""
            state.planKey = ""
            state.printOrderId = ""
            state.modeOrikomi = ""
            state.planKeyOrikomi = ""
            state.orderKeyOrikomi = ""
        }
    },
    getters:{
        mode(state){
            return state.mode
        },
        mapUrlOption(state){
           // alert("mode==" + state.mode)
            if(state.mode == modePlanKey){
                return '&plan_key=' + state.planKey + '&access_type=authorizer'
            }else if (state.mode == modePrintOrderId){
                return '&print_order_id=' +  state.printOrderId  + '&access_type=authorizer'
            }else{
                return ""
            }
        },
        mapUrlOptionOrikomi(state){
            if(state.modeOrikomi == modePlanKey){
                return '&plan_key=' + state.planKeyOrikomi
            }else if (state.modeOrikomi == modeOrderKey){
                return '&order_key=' + state.orderKeyOrikomi
            }else{
                return ""
            }
        },

    },
    plugins: [createPersistedState()],
})

export{
    mapModeStore,
    modePlanKey,
    modeOrderKey,
    modePrintOrderId,
}