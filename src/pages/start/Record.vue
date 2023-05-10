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
                    <f7-button @click="onClickFinishButton()" :class="finishButton">
                        <div class="finish-button-icon"></div>
                    </f7-button>
                    <f7-button v-show="!isPause" @click="onClickPauseButton()" class="pause-button">
                        <vue-feather class="pause-button-icon" type="pause-circle"></vue-feather>
                    </f7-button>
                    <f7-button v-show="isPause" @click="onClickResumeButton()" class="resume-button">
                        <vue-feather :class="resumeButtonIcon" type="play-circle"></vue-feather>
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
import {Record} from "@/record";
import {audioStore} from "../../stores/app-stores";

const isPause = ref(false)

const resumeButtonIcon = ref('resume-button-icon')

const router = useRouter();

const recordingTime = ref("00:15");

let time = 0

const recording = ref(false);

const finishButton = ref('finish-button');

const record = new Record(() => {
    console.log("授权成功")
})

record.setTimer(() => {
    time++;
    recordingTime.value = moment.utc((15 - time) * 1000).format('mm:ss');
    if (time === 2) {
        finishButton.value = "finish-button finish-button-activate"
    }
    if (time === 15) {
        record.pause();
        isPause.value = true;
        resumeButtonIcon.value = 'resume-button-icon resume-button-icon-disabled'
    }
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
    if (time < 2) return;
    time = 0;
    recordingTime.value = "00:15"
    record.stop()
    recording.value = false;
    finishButton.value = "finish-button";
    resumeButtonIcon.value = 'resume-button-icon'
    audioStore.audioBlob = record.getBlob();
    //TODO
}

function onClickPauseButton() {
    record.pause();
    isPause.value = true;
}

function onClickResumeButton() {
    if (time === 15) return
    record.resume();
    isPause.value = false;
}

function onClickCloseButton() {
    record.stop();
    recording.value = false;
    time = 0;
    recordingTime.value = "00:15"
    finishButton.value = "finish-button";
    resumeButtonIcon.value = 'resume-button-icon';

}

onMounted(() => {
    record.setWaveView("waveform")
})

</script>

<style scoped lang="less">
@import '../../css/pages/record.less';

</style>