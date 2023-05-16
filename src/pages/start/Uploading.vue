<template>
    <f7-page>
        <div class="context">
            <div v-show="!error">
                <loader class="loader"></loader>
                <a class="processing-title">分析中</a>
                <a class="status">{{ processStatus }}</a>
            </div>
            <div v-show="error">
                <vue-feather stroke-width="1.3" type="alert-circle" class="error-icon"></vue-feather>
                <a class="error-title">分析错误</a>
                <a class="error-message">{{ errorMessage }}</a>
            </div>
        </div>
    </f7-page>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref} from 'vue'
import Loader from "@/components/loader.vue";
import type {ReturnMessage, WorkerMessage, WorkerProperty} from "@/script/interface/worker-message";
import MessageType from "../../script/enum/message-type";
import {useAnalyzeStore, useAudioStore, useConfig} from "@/stores/app-stores";
import {f7} from "framework7-vue";

const processStatus = ref('')
const errorMessage = ref('')

const error = ref(false)

const page: Ref<HTMLInputElement | null> = ref(null)

const analyzeStore = useAnalyzeStore();
const audioStore = useAudioStore();
const config = useConfig();

const analyzeWorker = new Worker(new URL('../../script/workers/analyze-worker.ts', import.meta.url), {type: 'module'});

onMounted(() => {
    if (window.Worker) {
        analyzeWorker.onmessage = (e: MessageEvent<ReturnMessage>) => {
            if (e.data.message === MessageType.FINISH) {
                //分析完成
                //TODO: 跳转到结果页面
            } else if (e.data.message === MessageType.ERROR) {
                //分析错误
                const property = e.data.property;
                processStatus.value = property.processStatus;
                errorMessage.value = property.errorMessage;
                error.value = property.error;
                analyzeStore.analyzeResults = property.analyzeResults;
            } else if (e.data.message === MessageType.PROCESS) {
                //分析中返回的信息
                const property = e.data.property;
                processStatus.value = property.processStatus;
                errorMessage.value = property.errorMessage;
                error.value = property.error;
                analyzeStore.analyzeResults = property.analyzeResults;
            }
        };
        //开始分析
        analyzeWorker.postMessage(<WorkerMessage>{
            message: MessageType.START,
            property: <WorkerProperty>{
                processStatus: processStatus.value,
                errorMessage: errorMessage.value,
                error: error.value,
                audioUrl: audioStore.audioUrl,
                analyzeResults: null,
                serverUrl: config.serverUrl,
                retryTimes: config.retryTimes,
            },
        });
    } else {
        // 不支持worker
        console.log('不支持worker');
        f7.toast.show({
            text: '浏览器不支持Worker，请尝试升级版本或使用Chrome浏览器',
            position: "bottom",
            closeTimeout: 2000,
            cssClass: 'toast'
        });
        error.value = true;
        errorMessage.value = '浏览器不支持Worker';
    }

})


</script>

<style scoped lang="less">
@import "../../css/pages/processing.less";
</style>