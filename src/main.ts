import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSpinner,
  faBatteryFull,
  faBatteryHalf,
  faBatteryEmpty,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSpinner, faBatteryFull, faBatteryHalf, faBatteryEmpty, faCircleInfo)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
