import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate";
import {mapModeStore} from "./map-mode-store";

const authStore = new Vuex.Store({
    state: {
        token: "",
        rawToken: "",
        name: "",
        department: "",
        authLevel: 0,

    },
    mutations: {
        updateToken(state, token) {
            state.token = token
            const tokenArray = token.split(" ");
            state.rawToken = tokenArray[1]
        },
        clearToken(state){
            state.token = ""
            state.rawToken = ""
        },
        updateName(state,name){
            state.name = name
        },
        updateDepartment(state,department){
            state.department = department
        },
        updateAuthLevel(state,authLevel){
            state.authLevel = authLevel
        },

    },
    getters: {
        isAuthorized: state => state.token.length > 0,
        rawToken: state => state.rawToken,
        mapUrl: (state) => {
          //  alert("z" + mapModeStore.getters.mode + mapModeStore.getters.mapUrlOption)
            return state.rawToken + mapModeStore.getters.mapUrlOption
        },
        mapUrlOrikomi: (state) => {
            return state.rawToken + mapModeStore.getters.mapUrlOptionOrikomi
        },
        authLevel: state => state.authLevel
    },
    plugins: [createPersistedState()],
})

export {
    authStore,
}