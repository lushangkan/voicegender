<template>

  <f7-page class="page-record">
      <div class="view-record">
        <a class="page-title-text">录音</a>
      </div>

      <div class="view-waveform">
        <!-- <AVMedia canv-class="waveform" :media="stream" type="frequ" frequ-lnum="30" frequ-direction="mo" canv-height="80"	canv-width="300" line-color="darkorange" /> -->
        <Transition name="waveform">
          <div v-show="!recording" class="waveform-dark"></div>
        </Transition>
        <div class="waveform"></div>
      </div>

      <div class="view-time">
        <a class="view-time-text">{{ recordingTime }}</a>
      </div>

      <transition name="record">
        <f7-button v-show="!recording" @click="onClickRecordButton()" class="start-button">
          <vue-feather class="start-icon" type="mic"></vue-feather>
        </f7-button>
      </transition>


      <transition name="recording">
        <div v-show="recording" class="view-button-recording">
          <div class="button-bg">
            <f7-button @click="onClickFinishButton()" class="finish-button">
              <div class="finish-button-icon"></div>
            </f7-button>
            <f7-button v-show="!isPause" @click="onClickPauseButton()" class="pause-button">
              <vue-feather class="pause-button-icon" type="pause-circle"></vue-feather>
            </f7-button>
            <f7-button v-show="isPause" @click="onClickResumeButton()" class="resume-button">
              <vue-feather class="resume-button-icon" type="play-circle"></vue-feather>
            </f7-button>
            <f7-button @click="onClickCloseButton()" class="close-button">
              <vue-feather class="close-button-icon" type="x"></vue-feather>
            </f7-button>
          </div>
        </div>
      </transition>

  </f7-page>
</template>

<script setup lang="ts">
import {onMounted, ref, computed, reactive, inject} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {f7} from 'framework7-vue';
import moment from "moment";
import Recorder from 'recorder-core'
import {Record} from "@/record";

const isPause = ref(false)

const router = useRouter();

const recordingTime = ref("00:00:00");

let time = 0

const recording = ref(false);

const stream = ref();

const record = new Record(() => {
  console.log("授权成功")
})

record.setTimer(() => {
  time++;
  console.log(time)
  recordingTime.value = moment.utc(time * 1000).format('HH:mm:ss');
}, 1000)

function onClickRecordButton() {
  if (record.isOpen()) {
    recording.value = true;
    record.start()
  } else {
    f7.toast.show({
      text: '录音对象暂未初始化完毕,请稍后再试',
      position: "bottom",
      closeTimeout: 2000,
      cssClass: 'toast'
    })
    console.log('录音对象暂未初始化完毕,请稍后再试')
  }
}

function onClickFinishButton() {
  time = 0;
  recordingTime.value = "00:00:00"
  record.stop()
  recording.value = false;
}

function onClickPauseButton() {
  record.pause();
  isPause.value = true;
}

function onClickResumeButton() {
  record.resume();
  isPause.value = false;
}

function onClickCloseButton() {
  record.stop()
  recording.value = false;
  time = 0;
  recordingTime.value = "00:00:00"
}

onMounted(() => {
  record.setWaveView("waveform")
})

</script>

<style scoped lang="less">
@import '../../css/pages/record.less';

</style>