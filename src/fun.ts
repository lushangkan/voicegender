import {f7} from "framework7-vue";
import router from "@/routes/router";
import {routerMap} from "@/routes/router";
import * as stores from '@/stores/app-stores';
import type {AnalyzeStatus, RequestStatus} from "@/interface/status";
import type {ModelResults} from "@/interface/results";


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

export function getAnalyzeStatus(uuid: string) {
    return new Promise((resolve, reject) => {
       get(`${stores.config.serverUrl}/analyze/${uuid}/status`).then((res) => {
           // @ts-ignore
           const json = JSON.parse(res);
           if (json.status.code != 200) {
               reject(<RequestStatus>{
                   status: json.status,
               });
           } else {
               resolve(<AnalyzeStatus>{
                   status: json.analyzeStatus,
               })
           }
       }).catch((err) => {
           reject(err);
       });
    });
}

export function getAnalyzeResult(uuid: string) {
    return new Promise((resolve, reject) => {
        get(`${stores.config.serverUrl}/analyze/${uuid}/result`).then((res) => {
            // @ts-ignore
            const json = JSON.parse(res);
            if (json.status.code != 200) {
                reject(<RequestStatus>{
                    status: json.status,
                });
            }
            resolve(<ModelResults>json.modelResult);
        }).catch((err) => {
            reject(err);
        });
    });
}

export function uploadFile(audioBlob: string) {
    return new Promise((resolve, reject) => {
        if (audioBlob === null) reject('No audio file selected')

        const formData = new FormData();
        // @ts-ignore
        formData.append('file', audioBlob);

        post(formData, `${stores.config.serverUrl}/analyze`).then((res) => {
            // @ts-ignore
            const json = JSON.parse(res);
            // @ts-ignore
            const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');
            if (regex.test(<string>json.analyzeUUID)) {
                resolve(json.analyzeUUID);
            } else {
                reject(<RequestStatus>{
                    status: json.status,
                });
            }
        }).catch((err) => {
            console.error('Failed to upload file', err);
        })
    })
}

export function checkStatus() {
    return new Promise((resolve, reject) => {
        get(`${stores.config.serverUrl}/status`).then((res) => {
            if (res === null || res === undefined) {
                reject('Failed to check status');
            }
            // @ts-ignore
            const json = JSON.parse(res);
            resolve(<RequestStatus>{
                status: json.status,
            });
        }).catch((err) => {
            console.error('Failed to check status', err);
            reject(err)
        })
    });
}

export function post(formData: FormData, url: string){
    return new Promise((resolve, reject) => {
        for (let i = 1; i < stores.config.retryTimes; i++) {
            let error: any = null;
            let result: string | null = null;
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, false);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    result = xhr.responseText;
                } else {
                    error = xhr.statusText;
                }
            };
            xhr.onerror = () => {
                error = xhr.statusText;
            };
            xhr.send(formData);
            if (error != null && i < stores.config.retryTimes) {
                reject(error);
            } else if (error != null) {
                console.warn(`Failed to post ${i} time(s)`, error);
            } else {
                resolve(result);
                break;
            }
        }
    });
}

export function get(url: string) {
    return new Promise((resolve, reject) => {
        for (let i = 1; i < stores.config.retryTimes; i++) {
            let error: string | null = null;
            let result: string | null = null;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    result = xhr.responseText;
                } else {
                    error = xhr.statusText;
                }
            };
            xhr.onerror = () => {
                error = xhr.statusText;
            };
            xhr.ontimeout = () => {
                error = 'Timeout';
            }
            xhr.send();
            if (result != null){
                resolve(result);
                break;
            } else if (error != null && i > stores.config.retryTimes) {
                reject(error);
            } else if (error != null) {
                console.warn(`Failed to post ${i} time(s)`, error);
            }
        }
    });
}