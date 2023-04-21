import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate";

const functionStore = new Vuex.Store({
    state: {
        preventScrollFunction: Function,
        modalOkExecute: Function,
        modalOkExecuteWithArgs: Function,
        modalArgs : Object
    },
    mutations:{
        updateModalOkExecute(state,modalOkExecute){
            state.modalOkExecute = modalOkExecute
        },
        updateModalOkExecuteWithArgs(state,modalOkExecuteWithArgs){
            state.modalOkExecuteWithArgs = modalOkExecuteWithArgs
        },
        updateModalArgs(state,modalArgs){
            state.modalArgs = modalArgs
        }
    },
    getters: {
        preventScrollFunction: state => state.preventRollFunction,
        modalOkExecute: state => state.modalOkExecute,
        modalOkExecuteWithArgs: state => state.modalOkExecuteWithArgs,
        modalArgs: state => state.modalArgs,
    },
    plugins: [createPersistedState()],
})


const initFunctionStore = () => {
   const prevetScroll = function (event){
        if(! event.target.classList.contains("a_r")){
            event.preventDefault();
        }
    }

    functionStore.state.preventRollFunction = prevetScroll
}

export {
    functionStore,
    initFunctionStore,
}