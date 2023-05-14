import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate";

const allMenuStore = new Vuex.Store({
    state:{
        allMenuList:{},
    },
    mutations:{
        updateAllMenuList(state,allMenuList){
            state.allMenuList = allMenuList;
        }
    },
    getters:{
        findPaperSizeJName: (state) => (name) => {
            for(let i = 0; i < state.allMenuList.paper_sizes.options.length;i++){
                if(state.allMenuList.paper_sizes.options[i].name == name){
                    return state.allMenuList.paper_sizes.options[i].name_j;
                }
            }
            return "";
        },
        findMethodsJName: (state) => (name) => {
            for(let i = 0; i < state.allMenuList.methods.options.length;i++){
                if (state.allMenuList.methods.options[i].name === name){
                    return state.allMenuList.methods.options[i].name_j;
                }
            }
            return "";
        },
        findPostingStatusJName: (state) => (intNumber) =>{
            if(intNumber==0){
                return "原稿審査承認前"
            }else if(intNumber==1){
                return "原稿審査確認中"
            }else if(intNumber==2){
                return "原稿審査確認済み"
            }else if(intNumber==3){
                return "配布依頼中"
            }else if(intNumber==4){
                return "配布報告完了待ち"
            }else if(intNumber==5){
                return "配布報告完了済み"
            }else if(intNumber==6){
                return "原稿審査承認 NG"
            }else if(intNumber==7){
                return "キャンセル"
            }else{
                return ""
            }
        },
        findAreaLevelJName: (state) => (areaLevel) =>{
            if(areaLevel == "town"){
                return "町丁目";
            }else if(areaLevel == "municipality"){
                return "市区町村";
            }
        },
    },

    plugins: [createPersistedState()],
})


export {
    allMenuStore,
}