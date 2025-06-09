import { createApp } from 'vue'
import './style.css'
import MainLayout from './layouts/MainLayout.vue'
import naive from 'naive-ui'
import {router} from './router'
import { createPinia } from 'pinia'
const pinia = createPinia();

createApp(MainLayout).use(router).use(naive).use(pinia).mount('#app')
