import {reactive, ref} from 'vue'
import type {Ref} from 'vue'

export const panelStore = reactive({
    stateMap: new Map<string, boolean>([
        ['home', true],
        ['start', false],
        ['link', false],
        ['about', false]
    ]),
    refMap: <null | Map<string, Ref<null | HTMLInputElement>>>null,
})

export const audioStore = reactive({
    audioBlob: <string | null>null,
})

export const config = reactive({
    serverUrl: 'https://vgs.cutemc.cn',
})