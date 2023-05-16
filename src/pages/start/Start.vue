<template>

    <f7-page name="start" class="start-bg">
        <f7-view class="mode">
            <a class="mode-title">请选择</a>

            <div class="mode-button">
                <div class="record">
                    <f7-button @click="clickRecordButton" class="record-button">
                        <vue-feather type="mic" class="record-icon"></vue-feather>
                    </f7-button>
                    <a class="record-text">录音</a>
                </div>
                <div class="file">
                    <f7-button @click="clickFileButton" class="file-button">
                        <vue-feather type="folder" class="file-icon"></vue-feather>
                    </f7-button>
                    <a class="file-text">文件</a>
                </div>
            </div>

        </f7-view>

    </f7-page>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from "vue-router";
import { useAudioStore } from '../../stores/app-stores'
import * as fun from '../../script/fun'

const route = useRoute();
const router = useRouter();

const audioStore = useAudioStore();

function clickRecordButton() {
    fun.switchPage('record')
}

function clickFileButton() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';

    input.onchange = (e) => {
        // @ts-ignore
        audioStore.audioUrl = (e.target!).files[0];
        fun.switchPage('uploading')
    }

    input.click();
}

</script>

<style scoped>
@import '../../css/pages/start.less';
</style>