<template>
  <Header msg=""/>
  <div class="scroll_test">
    <p v-for="(num, i) in 10000">{num},{i}</p>


  </div>
</template>

<script>
import Header from '@/components/Header.vue';
export default {
  name: "ScrollTest",
  components: {
    Header,
  },
}
</script>

<style scoped lang="scss">
body{
  overflow-y:scroll !important;
}
.scroll_test{
  height: auto;
  background-color: #42b983;
}
.scroll_test2{
  height: 2000px;
  background-color: #DC3545;
}
</style>