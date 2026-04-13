<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="logo">
        <img :src="logo" alt="logo" class="logo-img" />
      </router-link>
    </div>

    <div class="navbar-center">
      <form @submit.prevent="handleSearch">
        <input
            v-model="search"
            type="text"
            placeholder="Rechercher une annonce..."
            class="search-input"
        />
      </form>
    </div>

    <div class="navbar-right" v-if="user">
      <router-link to="/annonces/create" class="publish-btn">
        Publier une annonce
      </router-link>

      <router-link to="/profile" class="username-btn">
        {{ user.username }}
      </router-link>
    </div>

    <div class="navbar-right" v-else>
      <router-link to="/login" class="nav-link">Se connecter</router-link>
      <router-link to="/register" class="nav-link register-btn">Créer un compte</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/images/logo_taskman.png'

const search = ref('')
const user = ref(null)
const router = useRouter()

onMounted(() => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

function handleSearch() {
  const value = search.value.trim()

  if (!value) {
    router.push({ path: '/' })
    return
  }

  router.push({
    path: '/',
    query: { search: value }
  })
}

</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #ddd;
  background-color: white;
  gap: 24px;
}

.navbar-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 32px;
  object-fit: contain;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar-center form {
  width: 100%;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 700px;
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.navbar-right {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: black;
  font-weight: 500;
}

.register-btn {
  padding: 8px 14px;
  border: 1px solid darkorange;
  border-radius: 8px;
}

.publish-btn {
  padding: 8px 22px;
  min-width: 190px;
  text-align: center;
  background: darkorange;
  color: darkblue;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
}

.publish-btn:hover {
  background: darkblue;
  color: darkorange;

}

.username-btn {
  padding: 8px 22px;
  min-width: 190px;
  text-align: center;
  border-radius: 8px;
  background: darkblue;
  color: darkorange;
  text-decoration: none;
  font-weight: 500;
}

.username-btn:hover {
  background: darkorange;
  color: darkblue;
}

</style>