import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AnnonceDetailView from '@/views/AnnonceDetailView.vue'
import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/annonces/:id', component: AnnonceDetailView },
    { path: '/:pathMatch(.*)*', component: NotFoundView}
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router