import { createApp } from 'vue'
import './scss/base.scss';
import App from './App.vue'
import {createPinia} from 'pinia';

declare global {
  interface Window {
    dragscroll: any;
  }

  interface String {
    colorSubString(subStr: string, hexColorCode: string): String;
  }
}

createApp(App)
  .use(createPinia())
  .mount('#app')
