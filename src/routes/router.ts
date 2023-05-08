import HomePage from '../pages/Home.vue';
import StartPage from '../pages/start/Start.vue';
import RecordPage from '../pages/start/Record.vue';
import ProcessingPage from "@/pages/start/Processing.vue";
import NotFoundPage from '../pages/404.vue';


import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => HomePage,
        name: 'home',
        meta: { transition: 'home' },
    },
    {
        path: '/start',
        component: () => StartPage,
        name: 'start',
        meta: { transition: 'home' },
    },
    {
        path: '/start/record',
        component: () => RecordPage,
    },
    {
        path: '/start/processing',
        component: () => ProcessingPage,
    },

]

export const routerMap = new Map<string, string>()
for (let route of routes) {
    routerMap.set(route.name!, route.path)
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router;