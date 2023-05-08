import {f7} from "framework7-vue";
import type {Router} from "vue-router";
import type {Ref} from "vue";
import {toRaw} from "vue";
import router from "@/routes/router";
import {routerMap} from "@/routes/router";
import {animate} from "dom7";
import * as stores from '@/stores/app-stores';


export function switchPage(switchTo: string) {
    for (let key of stores.panelStore.stateMap.keys()) {
        if (stores.panelStore.stateMap.get(key) == true) {
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