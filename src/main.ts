import { createApp } from 'vue'
import './scss/base.scss';
import App from './App.vue'
import {createPinia} from 'pinia';

createApp(App)
  .use(createPinia())
  .mount('#app')
