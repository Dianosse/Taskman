<template>
  <div class="container">

    <h1>Se connecter</h1>

    <form @submit.prevent="handleLogin" novalidate>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />

      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p>
      Pas de compte ?
      <router-link to="/register">Créer un compte</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '@/services/auth.service';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref(null);

const router = useRouter()

function validateForm() {

  if (!email.value) {
    error.value = 'Email is required.';
    return false;
  }

  if (!password.value) {
    error.value = 'Password is required.';
    return false;
  }

  return true;
}

async function handleLogin() {
  try {

    if(!validateForm()) {
      return;
    }

    const res = await login({
      email: email.value,
      password: password.value
    });

    if (!res.success) {
      throw new Error('Login failed');
    }

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.data));

    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Login failed';
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
}

button {
  padding: 10px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>