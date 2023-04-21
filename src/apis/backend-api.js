import { authStore } from "@/store/auth-store";
import moment from "moment";
import {momentDateFormat, slashedDateFormat,momentDateTimeFormat,slashedDateTimeFormat} from "../utils/consts";
import {baseDomain,orikomiDomain} from "../utils/baseConsts";

export default (function (){

    const domain =  baseDomain  // "csv3.107.jp"
    const backendApiDomain = "https://" + domain + "/api"
    const orikomiApiDomain = "https://" + orikomiDomain + "/api"

    const backendWebSocketDomain = domain + ":9001"


    const fetchCorePosting = async (subPath, reqBody, outputObj = false, outputJson=true, cancelToken=false) => {
        return fetchCore(backendApiDomain, subPath, reqBody, outputObj, outputJson, cancelToken)
    }

    const fetchCoreOrikomi = async (subPath, reqBody, outputObj = false, outputJson=true, cancelToken=false) => {
        return fetchCore(orikomiApiDomain, subPath, reqBody, outputObj, outputJson, cancelToken)
    }

    const fetchCore = async (domain, subPath, reqBody, outputObj = false, outputJson=true, cancelToken=false) => {
        if (!authStore.getters.isAuthorized && subPath !== "/v2/password_login") {
            return null
        }

        const   opts = {
            headers: {
                "Content-Type": "application/json",
                Authorization: authStore.state.token
            },
            method: "POST",
        }

        if (reqBody) {
            opts.body = JSON.stringify(reqBody)
            console.log(reqBody)
        }


        const resp =  await fetch(domain + subPath, opts)

        //Expired Token  //Wrong Token の場合はログインページに遷移

        if (!cancelToken) {
            if (resp.headers.get("Authorization")) {
                authStore.commit("updateToken", resp.headers.get("Authorization"))
            }
        }

        if (outputJson) {
            const jsonObj = await resp.json()
            if(jsonObj.error_message == "Expired Token" || jsonObj.error_message == "Wrong Token"){
                authStore.commit("updateToken","")
                location.href = "/login"
            }
            return jsonObj
        }

        const bodyText = await resp.text()



        if (bodyText.length === 0) {
            return null
        }

        const bodyObj = JSON.parse(bodyText)

        if (outputObj) {
            console.log(bodyObj)
        }

        return bodyObj
    }

    const tryLogin = async(userId,password,baseUrl,callbackUrl,returnUrl) =>{
        const obj = {
            user_id : userId,
            password : password,
            base_url : baseUrl,
            callback_url:callbackUrl,
            return_url : returnUrl
        }
        return fetchCorePosting("/v2/password_login",obj)
    }


    const refCartGroupBy = async () => {
        return fetchCorePosting("/v2/cart/ref_group_by")
    }

    const refCartGroupByOrikomi = async () => {
        return fetchCoreOrikomi("/v1/cart/ref_group_by")
    }

    const allMenuList = async () =>{
        return fetchCorePosting("/v1/all_menu_list")
    }
/*
    const refOrderLimit = async(limit,postingStatus = -1) => {
        const obj = {
            limit : limit,
            posting_status : postingStatus
        }
        return fetchCore("/v2/order/ref_limit",obj)
    }*/

    const refOrderLimitGroupBy = async(limit,postingStatus ,printOrderId,refText ,fromTime,toTime) => {
        const obj = {
            limit : limit,
            posting_status : postingStatus,
            print_order_id : printOrderId,
            ref_text : refText,
            from_time : fromTime,
            to_time : toTime
        }
        return fetchCorePosting("/v2/order/ref_limit_group_by",obj)
    }

    const refOrderLimitGroupByOrikomi = async(limit,status ,orderKey,refText ,fromTime,toTime) => {
        const obj = {
            limit : limit,
            status : status,
            order_key: orderKey,
            ref_text : refText,
            from_time : fromTime,
            to_time : toTime
        }
        return fetchCoreOrikomi("/v1/order/ref_limit_group_by",obj)
    }

    const refOrderFileName = async(printOrderId) =>{
        const obj = {
            print_order_id:printOrderId
        }
        return fetchCorePosting("/v2/order/file/name",obj)
    }

    const refOrderFileNameOrikomi = async(orderKey) => {
        const obj = {
            order_key:orderKey
        }
        return fetchCoreOrikomi("/v1/order/get_media_name",obj)
    }

    const uploadOrderFileOrikomi = async(orderKey,filaName,fileData) => {
        const obj = {
            order_key: orderKey,
            file_name: fileName,
            file_data: fileData
        }
        return fetchCoreOrikomi("/api/v1/order/upload_media",obj)
    }
    const orderReceive = async(planKey,dataType) => {

        if(dataType == "posting"){
            const obj = {
                plan_key : planKey,
                print_order_id : planKey
            }
            return fetchCorePosting("/v2/order/receive",obj)
        }else{
            const obj = {
                plan_key : planKey
            }
            return fetchCoreOrikomi("/v1/order/receive",obj)
        }

    }

    const refOnProcessOrders = async(onProcessType) => {
        const obj = {
            on_process_type: onProcessType
        }
        return fetchCorePosting("/v2/order/ref_on_process_orders",obj)
    }

    const refOnProcessOrders2dArray = async(onProcessType) => {
        const obj = {
            on_process_type: onProcessType
        }
        return fetchCorePosting("/v2/order/ref_on_process_orders_group_by",obj)
    }

    const refOnProcessOrders2dArrayOrikomi = async(onProcessType) => {
        const obj = {
            on_process_type: onProcessType
        }
        return fetchCoreOrikomi("/v1/order/ref_on_process_orders_group_by",obj)
    }

    const refOrderWithIdAndUserId = async(id) => {
        const obj = {
            id : Number(id)
        }
        return fetchCorePosting("/v2/order/ref_with_id_and_user_id",obj)
    }

    const refOrderOrikomi = async(orderKey) => {
        const obj = {
            order_key : orderKey
        }
        return fetchCoreOrikomi("/v1/order/ref",obj)
    }

    const accountList = async() => {
      /*  const obj = {
            id : Number(id)
        }*/
        return fetchCorePosting("/v2/account_list")
    }
    const accountUpdate = async(account) => {
        return fetchCorePosting("/v2/account/update",account)
    }

    const accountInsert = async(account) =>{
        return fetchCorePosting("/v2/account/add",account)
    }

    const accountDelete = async(account) =>{
        return fetchCorePosting("/v2/account/delete",account)
    }

    const myAccountInfo = async() =>{
        return fetchCorePosting("/v2/my_account_info")
    }

    const myAccountInfoUpdate = async(accountInfo) =>{
        return fetchCorePosting("/v2/my_account_info_update",accountInfo)
    }

    const myAccountFirstAddressUpdate = async(firstAddress) =>{
        return fetchCorePosting("/v2/my_account_first_address_update",firstAddress)
    }

    const myAccountPasswordUpdate = async(accountPassword) =>{
        return fetchCorePosting("/v2/my_account_password_update",accountPassword)
    }

    const updateTrackingInfo = async(orderId,destinationId,shippingCompany,tracking,dataType) =>{
        if (dataType == "posting"){
            const obj = {
                order_id: Number(orderId),
                destination_id:Number(destinationId),
                shipping_company: shippingCompany,
                tracking: tracking
            }
            return fetchCorePosting("/v2/order/update/tracking",obj)
        }else if(dataType == "orikomi"){
            const obj = {
                order_key: orderId,
                destination_id:Number(destinationId),
                shipping_company: shippingCompany,
                tracking: tracking
            }
            return fetchCoreOrikomi("/v1/order/update_tracking",obj)
        }

    }

    const authorizePlans = async(groupId) => {
         const obj = {
             group_id : Number(groupId),
         }
         return fetchCorePosting("/v2/plan/authorize",obj)
    }

    const authorizePlansOrikomi = async(groupId) => {
        const obj = {
            group_id : Number(groupId),
        }
        return fetchCoreOrikomi("/v1/plan/authorize",obj)
    }

    //通常は、apiを叩くたびに、チェックがなされるが、mapは別プレジェクトであるため、mapに遷移する前にtokenの真正をチェックする
    const verifyToken = async () =>{
        return fetchCorePosting("/v2/verify_token")
    }

    const planHistory = async () =>{
        console.log(moment());
        console.log(slashedDateTimeFormat);
        let fromDate = moment().utcOffset(9).add(-1,"years");
        //万一の時間の狂いを考慮して1時間先までの日付けとする
        let toDate   = moment().utcOffset(9).add(1,"hours");
        console.log(fromDate.format(slashedDateTimeFormat))
        console.log(toDate.format(slashedDateTimeFormat))
        const obj = {
            from_datetime: fromDate.format(slashedDateTimeFormat),
            to_datetime : toDate.format(slashedDateTimeFormat),
        }
        return fetchCorePosting("/v1/plan/history",obj)
    }

    const deleteCart = async (planKey,dataType) =>{
        const obj = {
            plan_key: planKey
        }

        if(dataType == "posting"){
            return fetchCorePosting("/v2/cart/delete",obj)
        }else{
            return fetchCoreOrikomi("/v1/cart/delete",obj)
        }

    }



    return {
        tryLogin,
        allMenuList,
        planHistory,
        //refCart,
    /*    refOrderLimit,*/
        orderReceive,
        refOnProcessOrders,
        refOrderWithIdAndUserId,
        backendWebSocketDomain,
        refOrderFileName,
        refOrderFileNameOrikomi,
        updateTrackingInfo,
        deleteCart,
        verifyToken,
        refCartGroupBy,
        refCartGroupByOrikomi,
        refOnProcessOrders2dArray,
        refOnProcessOrders2dArrayOrikomi,
        refOrderLimitGroupBy,
        refOrderLimitGroupByOrikomi,
        accountList,
        accountUpdate,
        accountInsert,
        accountDelete,
        myAccountInfo,
        myAccountInfoUpdate,
        myAccountFirstAddressUpdate,
        myAccountPasswordUpdate,
        authorizePlans,
        authorizePlansOrikomi,
        uploadOrderFileOrikomi,
        refOrderOrikomi,
    }

}())


