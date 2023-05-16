import {f7} from "framework7-vue";
import router from "@/routes/router";
import {routerMap} from "@/routes/router";
import type {Ref} from "vue";
import { usePanelStore } from "@/stores/app-stores";

export function switchPage(switchTo: string) {
    if (usePanelStore().stateMap.get(switchTo) != null) {
        for (let key of usePanelStore().stateMap.keys()) {
            if (usePanelStore().stateMap.get(key) == true) {
                // @ts-ignore
                const bottom: HTMLInputElement = {...(usePanelStore().refMap?.get(key)?.value!)}.elRef;
                const img = bottom.getElementsByTagName('i')[0];
                const text = bottom.getElementsByTagName('a')[0];

                bottom.classList.remove('menu-selected')
                img.classList.remove('menu-selected-icon')
                text.classList.remove('menu-selected-text')
            }

            usePanelStore().stateMap.set(key, false);
        }

        usePanelStore().stateMap.set(switchTo, true);

        // @ts-ignore
        const bottom = {...usePanelStore().refMap?.get(switchTo)!.value!}.elRef;
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
    }
    if (router.currentRoute.value.name == switchTo) return;

    const path = routerMap.get(switchTo);

    if (path == undefined) throw new Error(`No path found for ${switchTo}`);

    router.push(path);
}

export function getParentPath() {
    return window.location.pathname.split('/')[1];
}

export function initPanel() {
    const parentPath = getParentPath();
    let parentName;
    if (parentPath === '') {
        parentName = 'home';
    } else {
        parentName = parentPath;
    }
    const now: Ref<HTMLInputElement | null> | undefined = usePanelStore().refMap!.get(parentName!)!;
    if (now == null) {
        console.error(`No panel found for ${String(router.currentRoute.value.name)}`);
        return;
    }

    usePanelStore().stateMap.set(parentName, true);

    // @ts-ignore
    const bottom = {...now.value!}.elRef;
    const img = bottom.getElementsByTagName('i')[0];
    const text = bottom.getElementsByTagName('a')[0];

    bottom.classList.add('menu-selected')
    img.classList.add('menu-selected-icon')
    text.classList.add('menu-selected-text')
}