export class DialogFrameStateStore {

    constructor() {
        this._isVisible = false
        this._onChangeVisiblityFuncs = []
        this._onContinue =  false
    }

    set isVisible(val) {
        this._isVisible = val

        this._onChangeVisiblityFuncs.forEach(f => {
            if (typeof f === "function") {
                f(val)
            }
        })
    }

    set  onContinue(val){
        this._onContinue = val
    }

    get isVisible() {
        return this._isVisible
    }

    get onContinue(){
        return this._onContinue
    }

    addOnChangeVisibilityFunc(f) {
        this._onChangeVisiblityFuncs.push(f)
    }

}
