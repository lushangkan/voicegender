import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from "./locale";
import Framework7 from "framework7/lite-bundle";
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';
import App from './App.vue'
import { MotionPlugin } from '@vueuse/motion'



import router from "@/routes/router";

import "framework7/css/bundle";
import './css/app.less';
import './css/fonts.less';

//Icon lib
import VueFeather from 'vue-feather';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

const app = createApp(App)

// Register All Framework7 Vue components
registerComponents(app);

app.use(createPinia())

app.use(MotionPlugin)

app.use(i18n)

//Route
app.use(router)

app.component(VueFeather.name, VueFeather)

app.mount('#app')
