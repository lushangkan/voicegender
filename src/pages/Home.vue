<template>

  <f7-page name="home" class="home-bg">
    <f7-views>
      <f7-block class="logo">
        <img class="logo-img" src="../assets/imgs/logo.svg" alt="Web logo">
        <a class="logo-text">voicegender</a>
      </f7-block>

      <f7-block>
        <a class="introduce-text">一个通过机器学习来识别人声性别的工具</a>
      </f7-block>

      <f7-block class="button-block">
        <f7-button @click="clickButton()" bg-color="white" class="start-button">
          <vue-feather type="arrow-right" class="start-icon"></vue-feather>
        </f7-button>
      </f7-block>
    </f7-views>
  </f7-page>


</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from "vue-router";
import * as fun from '../script/fun'

const router = useRouter();

function clickButton() {
  fun.switchPage('start');
}

onMounted(() => {
})

</script>

<style scoped>
@import '../css/pages/home.less';
</style>