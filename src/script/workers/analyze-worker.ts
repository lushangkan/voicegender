/// <reference lib="webworker" />

import MessageType from "../enum/message-type";
import type {ModelResults} from "../interface/results";
import type {ReturnMessage, WorkerMessage} from "@/script/interface/worker-message";
import {startAnalyze} from "./server_fun";

let running: boolean = false;

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    //消息: 启动
    if (e.data.message === MessageType.START) {
        if (running) return;
        running = true;
        let property = e.data.property;
        startAnalyze(property, (newProperty) => {
            property = newProperty;
            postMessage(<ReturnMessage>{
                message: MessageType.PROCESS,
                property: property,
            })
        }).then((result) => {
            property.analyzeResults = (<ModelResults>result);
            self.postMessage(<ReturnMessage>{
                message: MessageType.FINISH,
                property: property,
            });
        }).catch((err) => {
            property.error = true;
            property.errorMessage = err;
            console.error(err);
            self.postMessage(<ReturnMessage>{
                message: MessageType.ERROR,
                property: property,
            });
        })
    }
}

export {};