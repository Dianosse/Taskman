import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import AnnonceDetailView from '@/views/AnnonceDetailView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import ProfileView from '@/views/ProfileView.vue';
import UserDetailView from '@/views/UserDetailView.vue';
import EditProfileView from "@/views/EditProfileView.vue";
import FavoritesView from "@/views/FavoritesView.vue";
import ConversationsView from "@/views/ConversationsView.vue";
import CreateAnnonceView from '@/views/CreateAnnonceView.vue'
import EditAnnonceView from '@/views/EditAnnonceView.vue';
import ConversationMessagesView from '@/views/ConversationMessagesView.vue';


const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/annonces/:id', component: AnnonceDetailView },

    { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/users/:id', component: UserDetailView },
    { path: '/profile/edit', component: EditProfileView, meta: { requiresAuth: true } },
    { path: '/favorites', component: FavoritesView, meta: { requiresAuth: true } },
    { path: '/conversations', component: ConversationsView, meta: { requiresAuth: true } },
    { path: '/annonces/create', component: CreateAnnonceView, meta: { requiresAuth: true } },
    { path: '/annonces/:id/edit', component: EditAnnonceView, meta: { requiresAuth: true } },
    { path: '/conversations', component: ConversationsView, meta: { requiresAuth: true } },
    { path: '/conversations/:id', component: ConversationMessagesView, meta: { requiresAuth: true } },

    { path: '/:pathMatch(.*)*', component: NotFoundView }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        next('/login');
        return;
    }

    next();
})

export default router