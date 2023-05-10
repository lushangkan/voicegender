import {f7} from "framework7-vue";
import type {Router} from "vue-router";
import type {Ref} from "vue";
import {toRaw} from "vue";
import router from "@/routes/router";
import {routerMap} from "@/routes/router";
import {animate} from "dom7";
import * as stores from '@/stores/app-stores';
import {audioStore} from "@/stores/app-stores";


export function switchPage(switchTo: string) {
    for (let key of stores.panelStore.stateMap.keys()) {
        if (stores.panelStore.stateMap.get(key) == true) {
            // @ts-ignore
            const bottom: HTMLInputElement = {...(stores.panelStore.refMap?.get(key)?.value!)}.elRef;
            const img = bottom.getElementsByTagName('i')[0];
            const text = bottom.getElementsByTagName('a')[0];

            bottom.classList.remove('menu-selected')
            img.classList.remove('menu-selected-icon')
            text.classList.remove('menu-selected-text')
        }

        stores.panelStore.stateMap.set(key, false);
    }

    stores.panelStore.stateMap.set(switchTo, true);

    // @ts-ignore
    const bottom = {...stores.panelStore.refMap?.get(switchTo)!.value!}.elRef;
    const img = bottom.getElementsByTagName('i')[0];
    const text = bottom.getElementsByTagName('a')[0];

    bottom.classList.add('menu-selected')
    img.classList.add('menu-selected-icon')
    text.classList.add('menu-selected-text')

    if (switchTo === 'home') {
        f7.panel.close(undefined, false)
    } else {
        f7.panel.close(undefined, true)
    }

    if (router.currentRoute.value.name == switchTo) return;

    const path = routerMap.get(switchTo);

    if (path == undefined) throw new Error(`No path found for ${switchTo}`);

    router.push(path);
}

export function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export function uploadFile() {
    return new Promise((resolve, reject) => {
        if (audioStore.audioBlob === null) reject('No audio file selected')

        const formData = new FormData();
        // @ts-ignore
        formData.append('file', audioStore.audioBlob);

        post(formData, `${stores.config.serverUrl}/analyze`).then((res) => {
            // @ts-ignore
            const map: Map<string, string> = new Map(Object.entries(JSON.parse(res)));


        }).catch((err) => {
            console.error('Failed to upload file', err);
        })
    })
}

export function checkStatus() {
    return new Promise((resolve, reject) => {
        get(`${stores.config.serverUrl}/status`).then((res) => {
            if (res === null || !(res instanceof String)) {
                reject('Failed to check status');
            }
            // @ts-ignore
            const map: Map<string, string> = new Map(Object.entries(JSON.parse(res)));
            // @ts-ignore
            const statusMap: Map<string, string> | undefined = new Map(Object.entries(map.get('status')));

            if (statusMap.get('code') === '200') resolve(true);
        }).catch((err) => {
            console.error('Failed to check status', err);
            reject(err)
        })
    });
}

export function post(formData: FormData, url: string){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(formData);
    });
}

export function get(url: string) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
}