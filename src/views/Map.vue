<template>
  <div id="page_header">
      <Header msg=""/>
  </div>
 <!-- <div id="iframe_block" class="div-iframe"> -->
    <!-- <iframe id="iframe_test" src="https://map-ato-custom.107.jp/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJzYW5vdGVzdF8xMjM0NTY3ODkwIiwic2lkIjoxLCJjb21wYW55Ijoi5qCq5byP5Lya56S-5rOo5paHIiwiZGVwYXJ0bWVudCI6IuiyqeS_g-mDqOmWgCIsIm5hbWUiOiLnlLDkuK3kuIDpg44iLCJsYXQiOjM1LjY4OTc2NiwibG5nIjoxMzkuNzY3MzUsImJybCI6Imh0dHBzOi8vcG9zdGluZy4xMDcuanAiLCJjcmwiOiJodHRwczovL3Bvc3RpbmcuMTA3LmpwL3Bvc3RpbmcvY2FsbGJhY2siLCJycmwiOiJodHRwczovL3Bvc3RpbmcuMTA3LmpwL3Bvc3RpbmcvaW5kZXgiLCJpYXQiOiIyMDIyLTAxLTAyVDIzOjIxOjM2LjgzNjE1MTEwOVoiLCJleHAiOiIyMDIzLTAxLTAyVDIzOjIxOjM2LjgzNjE1MTEwOVoiLCJpc3MiOiIxMDcifQ==.U4sFqUnFw5TdOKlL2i7F0I5knXIx7F8DQxmWux4ZzjiOjid5CAj9C18FodAeX_MSioKSKqJ177qsIo2gZWmVhDzjMZvKcqihZWUqE5Woawl4EfA0I3TOZ3adJdX00EOxA-3N8BJItUb-6rDoHi_zKYBMKU2GBABkxnctUXqrKzQ=" title="automatic_estimate"  width="100%" height="90%"></iframe>-->
     <iframe id="iframe_header_on" class="iframe_test" :src="getIFrameSrc"
            title="automatic_estimate"  width="100%" height="100%"></iframe>
<!--  </div> -->



</template>

<script>
import Header from '@/components/Header.vue'
import {authStore} from "../store/auth-store";
import {mapModeStore} from "../store/map-mode-store";

export default {
  name: "Map",
  data() {
    return {
      authStore,
      mapModeStore,
    }
  },
  components: {
    Header
  },
  mounted() {
  //  alert("https://map-ato-custom2.107.jp/?token=" + this.authStore.getters.mapUrl)
    document.getElementsByClassName("iframe_test")[0].src =  "https://map-ato-customx.107.jp/?token=" + this.authStore.getters.mapUrl;
    document.querySelector('body').style.overscrollBehaviorY = 'none';
    document.querySelector('body').style.overflow = 'hidden';
    //document.getElementById("iframe_test").src = "https://map-ato-custom2.107.jp/?token=" + this.authStore.getters.rawToken;
   // document.getElementById("iframe_test").src = "http://localhost:8107/?token=" + this.authStore.getters.rawToken;
  },
  methods:{
    getIFrameSrc(){
     // alert("https://map-ato-custom2.107.jp/?token=" + this.authStore.getters.mapUrl)
      return "https://map-ato-customx.107.jp/?token=" + this.authStore.getters.mapUrl;
      　//document.getElementById("iframe_test").src = "https://map-ato-custom.107.jp/?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJzYW5vdGVzdF8xMjM0NTY3ODkwIiwic2lkIjoxLCJjb21wYW55Ijoi5qCq5byP5Lya56S-5rOo5paHIiwiZGVwYXJ0bWVudCI6IuiyqeS_g-mDqOmWgCIsIm5hbWUiOiLnlLDkuK3kuIDpg44iLCJsYXQiOjM1LjY4OTc2NiwibG5nIjoxMzkuNzY3MzUsImJybCI6Imh0dHBzOi8vcG9zdGluZy4xMDcuanAiLCJjcmwiOiJodHRwczovL3Bvc3RpbmcuMTA3LmpwL3Bvc3RpbmcvY2FsbGJhY2siLCJycmwiOiJodHRwczovL3Bvc3RpbmcuMTA3LmpwL3Bvc3RpbmcvaW5kZXgiLCJpYXQiOiIyMDIyLTAxLTAyVDIzOjIxOjM2LjgzNjE1MTEwOVoiLCJleHAiOiIyMDIzLTAxLTAyVDIzOjIxOjM2LjgzNjE1MTEwOVoiLCJpc3MiOiIxMDcifQ==.U4sFqUnFw5TdOKlL2i7F0I5knXIx7F8DQxmWux4ZzjiOjid5CAj9C18FodAeX_MSioKSKqJ177qsIo2gZWmVhDzjMZvKcqihZWUqE5Woawl4EfA0I3TOZ3adJdX00EOxA-3N8BJItUb-6rDoHi_zKYBMKU2GBABkxnctUXqrKzQ="
     // document.getElementById("iframe_test").src = "https://map-ato-custom2.107.jp/?token=" + this.authStore.getters.rawToken;
      //document.getElementById("iframe_test").src = "http://localhost_8107/?token=" + this.authStore.getters.rawToken;
    },
  },

}

/*
let onPostMessage = function ( event ) {
  let origin = event.origin ;
  if( origin !== "https://map-ato-custom2.107.jp" ) return false ;

  let message = event.data.message ;
  if (message === "header_on") {
    let headerTag = document.getElementById("page_header");
    headerTag.style.display = "block";
    let iframeBlock = document.getElementById("iframe_block");
    iframeBlock.className = "div-iframe"
  }

  if (message === "header_off") {
    let headerTag = document.getElementById("page_header");
    headerTag.style.display = "none";
    let iframeBlock = document.getElementById("iframe_block");
    iframeBlock.className = "div-iframe-ful";
  }

  if (message === "cart_push") {
    const f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action',event.data.data.callback_url);
    const input = setParams('plan_key',event.data.data.plan_key);
    f.appendChild(input);
    const bodyElement = document.body ;
    bodyElement.append(f);
    f.submit();
    location.href = event.data.data.callback_url;

  }
  if (message === "window_close") {



  }
}
const setParams = function(name, value){
  const input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  return input;
}
addEventListener( "message", onPostMessage ) ;*/
</script>

<style scoped lang="scss">




/*
.div-iframe{
  margin-top:0;
  width:100%;
  height: calc(100vh - 70px);
  background-color: black;
}
.div-iframe-ful{
  margin-top:0;
  width:100%;
  height: 100vh;
  background-color: black;
}
iframe {
  border:none;
  width:100%;
  height:100%;
  overflow: auto;
}*/

</style>