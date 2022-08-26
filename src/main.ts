import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import '@/assets/css/common.css'
import '@/assets/js/flexible.js'
import '@/assets/css/iconfont.css'
import axios from '@/common/api/request'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { Swipe, SwipeItem, Lazyload,Stepper,Checkbox, CheckboxGroup, Dialog, AddressEdit,RadioGroup, Radio  } from 'vant';
import 'vant/lib/index.css';

import FunTab from 'fun-tab'
import 'fun-tab/dist/index.css'

const app = createApp(App)
const pinia  = createPinia();
app.provide('axios',axios);
app.use(ElementPlus);
app.use(FunTab);

app.use(SwipeItem).use(Lazyload).use(Swipe).use(Stepper).use(Checkbox).use(CheckboxGroup).use(Dialog).use(AddressEdit).use(RadioGroup).use(Radio);
app.use(router);
app.use(pinia).mount("#app");
