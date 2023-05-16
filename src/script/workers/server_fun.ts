import type {AnalyzeStatus, RequestStatus} from "@/script/interface/status";
import type {ModelResults} from "@/script/interface/results";
import type {WorkerProperty} from "@/script/interface/worker-message";
import {useAnalyzeStore, useAudioStore, useConfig} from "@/stores/app-stores";



export function getAnalyzeStatus(uuid: string, serverUrl: string, retryTimes: number) {
    return new Promise((resolve, reject) => {
        get(`${serverUrl}/analyze/${uuid}/status`, retryTimes).then((res) => {
            // @ts-ignore
            const json = JSON.parse(res);

            if (json.analyzeStatus.code == -1) {
                reject(<AnalyzeStatus>{
                    status: json.analyzeStatus,
                });
            } else if (json.status.code != 200) {
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

export function getAnalyzeResult(uuid: string, serverUrl: string, retryTimes: number) {
    return new Promise((resolve, reject) => {
        get(`${serverUrl}/analyze/${uuid}/result`, retryTimes).then((res) => {
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

export function uploadAudio(audio: string | File, serverUrl: string, retryTimes: number) {
    return new Promise((resolve, reject) => {
        if (audio === null) reject('No audio file selected')

        const formData = new FormData();
        // @ts-ignore
        if (audio instanceof File) formData.append('file', audio, audio.name);
        else formData.append('file', audio, 'audio.wav');

        console.log(audio)
        post(formData, `${serverUrl}/analyze`, retryTimes).then((res) => {
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

export function checkStatus(serverUrl: string, retryTimes: number) {
    return new Promise((resolve, reject) => {
        get(`${serverUrl}/status`, retryTimes).then((res) => {
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

export function post(formData: FormData, url: string, retryTimes: number = 10) {
    return new Promise((resolve, reject) => {
        for (let i = 1; i < retryTimes; i++) {
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
            if (error != null && i < retryTimes) {
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

export function get(url: string, retryTimes: number = 10) {
    return new Promise((resolve, reject) => {
        for (let i = 1; i < retryTimes; i++) {
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
            if (result != null) {
                resolve(result);
                break;
            } else if (error != null && i > retryTimes) {
                reject(error);
            } else if (error != null) {
                console.warn(`Failed to post ${i} time(s)`, error);
            }
        }
    });
}

export async function startAnalyze(property: WorkerProperty, updateFun: Function) {
    return new Promise((resolve, reject) => {
        if (property.audioUrl == null) {
            reject('AudioUrl为空');
            return;
        }

        property.processStatus = '正在检查服务器状态';
        updateFun(property);

        checkStatus(property.serverUrl, property.retryTimes).then((status) => {
            if ((<RequestStatus>status).status.code != 200) {
                reject('服务器状态异常');
                return;
            }
            property.processStatus = '正在上传音频';
            updateFun(property);
            uploadAudio(property.audioUrl!, property.serverUrl, property.retryTimes).then(async (uuid) => {
                property.processStatus = '正在分析音频';
                updateFun(property);

                let done = false;
                while (!done) {
                    await getAnalyzeStatus((<string>uuid), property.serverUrl, property.retryTimes).then((analyzeStatus) => {
                        if ((<AnalyzeStatus>analyzeStatus).status.code == 120) {
                            done = true;
                            return;
                        }
                        property.processStatus = '正在分析音频: ' + (<AnalyzeStatus>analyzeStatus).status.message;
                        updateFun(property);
                    }).catch((err) => {
                        if (err.status.code === -1) {
                            //分析错误
                            reject('分析错误: ' + err.status.message);
                        } else {
                            reject('获取分析状态失败: ' + err);
                        }

                        done = true;
                        return;
                    });
                }
                getAnalyzeResult((<string>uuid), property.serverUrl, property.retryTimes).then((result) => {
                    property.processStatus = '分析完成';
                    property.analyzeResults = (<ModelResults>result)
                    updateFun(property);
                    resolve(true);
                    return;
                }).catch((err) => {
                    reject('获取分析结果失败: ' + err);
                    return;
                });
                // 分析完成
            }).catch((err) => {
                reject('上传失败: ' + err);
                return;
            });
        }).catch((err) => {
            reject('服务器状态异常: ' + err);
            return;
        });
    });
}