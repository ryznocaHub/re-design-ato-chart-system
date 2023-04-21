import Vuex from "vuex"

const accountStore = new Vuex.Store({
    state:{
        accountList:[],
        myAccount:{},
    },
    mutations: {
        updateAccountList(state, accountList) {
            state.accountList = accountList
        },
        updateMyAccount(state,myAccount){
            state.myAccount = myAccount
        }
    },
    getters: {
        accountList: state => state.accountList,
        myAccount : state => state.myAccount,
    }



})

export {
    accountStore,
}