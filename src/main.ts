import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { vMaska } from 'maska/vue'
import App from './App.vue'
import router from './app/router'
import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
app.directive('maska', vMaska)

// Inicialização da Autenticação
import { useAuthStore } from '@/core/auth/authStore'
const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
})
