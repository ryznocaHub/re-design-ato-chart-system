import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate";

const cartStore = new Vuex.Store({
    state:{
        planArray:[],
        plan2dArray:[],
     //   onProcessUploadOrderArray:[],
        onProcessUploadOrder2dArray:[],
      //  onProcessShippingOrderArray:[],
        onProcessShippingOrder2dArray:[],
        totalPriceApproved : {
            "sub_total_price" : 0,
            "tax" : 0,
            "total_price" : 0
        },
        cartStatus : 1,
        paymentMethod: 'credit_card'
    },
    mutations:{
        updatePaymentMethod (state,paymentMehod_){
          state.paymentMethod = paymentMehod_
        },
        updateTotalPriceApproved (state, val){
            let x
            val[0].active ? x=val[0] : x=val[1]
            console.log("x updateTotalPriceApproved : ",x,state.totalPriceApproved)
            state.totalPriceApproved = {
                "sub_total_price" : state.totalPriceApproved.sub_total_price + x.sub_total_price,
                "tax" : state.totalPriceApproved.tax + x.tax,
                "total_price" : state.totalPriceApproved.total_price + x.total_price,
            }
        },
        updateTotalPriceApprovedOrikomi (state, val){
            let x = val
            console.log("x updateTotalPriceApproved : ",x,state.totalPriceApproved)
            state.totalPriceApproved = {
                "sub_total_price" : state.totalPriceApproved.sub_total_price + x.total_price,
                "tax" : state.totalPriceApproved.tax + x.tax,
                "total_price" : state.totalPriceApproved.total_price + x.total_price + x.tax,
            }
        },
        resetTotalPriceApproved(state){
            state.totalPriceApproved = {
                "sub_total_price" : 0,
                "tax" : 0,
                "total_price" : 0
            }
        },
        updatePlanArray(state,planArray){
            state.planArray = planArray;
        },
        updatePlan2dArray(state,plan2dArray){
            state.plan2dArray = plan2dArray;
        },

        updateCartStatus(state,cartStatus){
            console.log("cart_status");
            state.cartStatus = cartStatus;
            console.log(cartStatus)
        },
        updateCartStatusWithHref(state,cartStatus){
          //  state.cartStatus = cartStatus;
            location.href = "/cart?status=" + cartStatus
        },
   /*     updateOnProcessUploadOrderArray(state,onProcessUploadOrderArray){
            state.onProcessUploadOrderArray = onProcessUploadOrderArray;
        },*/
        updateOnProcessUploadOrder2dArray(state,onProcessUploadOrder2dArray){
            state.onProcessUploadOrder2dArray = onProcessUploadOrder2dArray;
        },
      /*  updateOnProcessShippingOrderArray(state,onProcessShippingOrderArray){
            state.onProcessShippingOrderArray = onProcessShippingOrderArray;
        },*/
        updateOnProcessShippingOrder2dArray(state,onProcessShippingOrder2dArray){
            state.onProcessShippingOrder2dArray = onProcessShippingOrder2dArray;
        },
    },
    getters: {
        cartCount: state => state.plan2dArray.length,
        activeCartCount(state){
            let count = 0;
            for (let i = 0 ; i < state.plan2dArray.length;i++){
                for(let j = 0 ; j < state.plan2dArray[i].length ; j++){
                    if(state.plan2dArray[i][j].extra.authorized){
                        count++
                    }
                }
            }
            return count;
        },
        planArray: state => state.planArray,
        plan2dArray: state => state.plan2dArray,
        cartStatus: state => state.cartStatus,
        uploadCount: state => state.onProcessUploadOrder2dArray.length,
        shippingCount: state => state.onProcessShippingOrder2dArray.length,
        //onProcessUploadOrderArray: state => state.onProcessUploadOrderArray,
        onProcessUploadOrder2dArray: state => state.onProcessUploadOrder2dArray,
        //onProcessShippingOrderArray: state => state.onProcessShippingOrderArray,
        onProcessShippingOrder2dArray: state => state.onProcessShippingOrder2dArray,
    },
    plugins: [createPersistedState()],
})


export {
    cartStore,
}