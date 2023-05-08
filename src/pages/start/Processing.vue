<template>
  <f7-page>
    <div class="context">
      <a class="processing-title">分析中</a>
      <loader class="loader"></loader>
      <a class="status">{{ processStatus }}</a>
    </div>
  </f7-page>
</template>

<script setup>
import { ref } from 'vue'
import Loader from "@/components/loader.vue";

const processStatus = ref("Analyzing voice 4/4 ..")

</script>

<style scoped lang="less">
@import "../../css/pages/processing.less";
</style>