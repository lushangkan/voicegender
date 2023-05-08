<template>
  <f7-app v-bind="f7params" >
    <f7-page>
      <f7-views>
        <f7-panel class="navbar-app" swipe swipe-only-close right>
          <f7-view>
            <f7-page>
              <f7-button @click="click" ref="home" class="home">
                <vue-feather type="home" class="home-icon"></vue-feather>
                <a class="home-text">主页</a>
              </f7-button>
              <f7-button @click="click" ref="start" class="start">
                <vue-feather type="disc" class="start-icon"></vue-feather>
                <a class="start-text">开始</a>
              </f7-button>

              <div class="menu-line"></div>

              <f7-button @click="click" ref="link" class="link">
                <vue-feather type="link" class="link-icon"></vue-feather>
                <a class="link-text">相关信息</a>
              </f7-button>
              <f7-button @click="click" ref="about" class="about">
                <vue-feather type="info" class="about-icon"></vue-feather>
                <a class="about-text">关于</a>
              </f7-button>

            </f7-page>
          </f7-view>
        </f7-panel>

        <f7-navbar class="app-navbar no-shadow no-hairline">
          <img class="logo-img-navbar" src="./assets/imgs/logo.svg" alt="Web logo">
          <f7-nav-title class="logo-text-navbar">voicegender</f7-nav-title>
          <f7-block class="menu-app">
            <f7-button panel-open="right" bg-color="white" class="menu-button">
              <vue-feather type="menu" class="menu-icon"></vue-feather>
            </f7-button>
          </f7-block>
        </f7-navbar>

        <router-view v-slot="{ Component }">
          <transition :name="route.meta.transition">
            <component :is="Component" />
          </transition>
        </router-view>

      </f7-views>
    </f7-page>
  </f7-app>
</template>
<script setup lang="ts">
  import {ref, onMounted, computed} from 'vue';
  import type {Ref} from 'vue'
  import { f7, f7ready, f7App, f7Page, f7View, f7Panel, f7Block, f7BlockFooter, f7List, f7LoginScreen, f7LoginScreenTitle, f7Link, f7Navbar, f7NavRight, f7Toolbar, f7Views, f7Popup, f7ListInput, f7ListButton  } from 'framework7-vue';
  import { getDevice }  from 'framework7/lite-bundle';
  import capacitorApp from './capacitor-app';
  import {useCounterStore} from '@/stores/counter';

  import { panelStore } from '@/stores/app-stores'
  
  import * as fun from '@/fun'

  import {useRoute, useRouter} from "vue-router";

  const route = useRoute();
  const router = useRouter();

  const device = getDevice();

  const home: Ref<HTMLInputElement | null> = ref(null);
  const start: Ref<HTMLInputElement | null> = ref(null);
  const link: Ref<HTMLInputElement | null> = ref(null);
  const about: Ref<HTMLInputElement | null> = ref(null);

  function click(event: Event) {
      const target = event.target as HTMLElement;

      if (target.className.includes("home")) {
        fun.switchPage('home');
      } else if (target.className.includes("start")) {
          fun.switchPage('start');
      } else if (target.className.includes("link")) {
          fun.switchPage('link');
      } else if (target.className.includes("about")) {
          fun.switchPage('about');
      }
  }
  
  // Framework7 Parameters
  const f7params = {
    name: 'Voicegender', // App name
    theme: 'md', // Automatic theme detection
    id: 'cn.cutemc.voicegender', // App bundle ID
    // App routes
    store: useCounterStore,

    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };


  onMounted(() => {
    f7ready(() => {
      // Init capacitor APIs (see capacitor-app.js)
      if (device.capacitor) {
        capacitorApp.init(f7);
      }
    });

    panelStore.refMap = new Map([
        ['home', home],
        ['start', start],
        ['link', link],
        ['about', about]
    ]);
  });
</script>