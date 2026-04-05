<template>
  <div class="container">
    <h1>Home</h1>

    <div v-if="user">
      <h2>Bienvenue {{ user.username }}</h2>

      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Bio :</strong> {{ user.bio }}</p>

      <p class="token">
        <strong>Token :</strong>
        <span>{{ token }}</span>
      </p>

      <button @click="logout">Logout</button>
    </div>

    <div v-else>
      <p>You are not logged in.</p>

      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null);
const token = ref(null);
const router = useRouter()

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');

  console.log(storedToken);

  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
  if (storedToken) {
    token.value = storedToken
  }
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  user.value = null

  router.push('/login')
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 100px auto;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px;
  cursor: pointer;
}
</style>