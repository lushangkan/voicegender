import {reactive, ref} from 'vue'
import type {Ref} from 'vue'
import type {ModelResults} from "@/script/interface/results";
import {defineStore} from "pinia";

export const usePanelStore = defineStore('panelStore', () => {
    const stateMap = ref(new Map<string, boolean>([
        ['home', true],
        ['start', false],
        ['link', false],
        ['about', false]
    ]));

    const refMap: Ref<null | Map<string, Ref<null | HTMLInputElement>>> = ref(null);

    return { stateMap, refMap };
});

export const useAudioStore = defineStore('audioStore' ,() => {
    const audioUrl: Ref<string | File | null> = ref(null);

    return { audioUrl };
});

export const useAnalyzeStore = defineStore( 'analyzeStore', () => {
    const analyzeResults: Ref<ModelResults | null> = ref(null);

    return { analyzeResults };
});

export const useConfig = defineStore('config', () => {
    const serverUrl: string = 'http://localhost/api';
    const retryTimes: number = 10;

    return { serverUrl, retryTimes };
});