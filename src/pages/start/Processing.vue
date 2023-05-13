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
import {onMounted, ref} from 'vue'
import Loader from "@/components/loader.vue";
import * as fun from '../../fun'
import {audioStore} from "@/stores/app-stores";

onMounted(() => {
})

</script>

<style scoped lang="less">
@import "../../css/pages/processing.less";
</style>