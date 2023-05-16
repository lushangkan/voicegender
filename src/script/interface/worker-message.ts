import type MessageType from '../enum/message-type';
import type {Ref} from 'vue';
import {reactive} from "vue";
import type {ModelResults} from "@/script/interface/results";

interface WorkerProperty  {
    processStatus: string,
    error: boolean,
    errorMessage: string,
    analyzeResults: ModelResults | null,
    audioUrl: string | File | null,
    serverUrl: string,
    retryTimes: number,
}

interface WorkerMessage {
    message: MessageType,
    property: WorkerProperty
}

interface ReturnMessage {
    message: MessageType,
    property: WorkerProperty
}

export type { WorkerMessage, WorkerProperty, ReturnMessage }