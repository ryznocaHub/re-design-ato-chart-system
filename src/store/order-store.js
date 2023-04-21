import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate";


const orderStore = new Vuex.Store({
    state:{
        orderArray:[],
        orderArray2d:[],
        currentOrder:{},  //orderDetail の際に使うか？使わないか？
    },
    mutations:{
        updateOrderArray(state,orderArray){
            state.orderArray = orderArray;
        },
        updateOrderArray2d(state,orderArray2d){
            state.orderArray2d = orderArray2d;
        },
        updateCurrentOrder(state,currentOrder){
            state.currentOrder = currentOrder;
        },
    },
    getters: {
        orderArray: state => state.orderArray,
        orderArray2d: state => state.orderArray2d,
        currentOrder: state => state.currentOrder,
    },
    plugins: [createPersistedState()],
})


export {
    orderStore,
}