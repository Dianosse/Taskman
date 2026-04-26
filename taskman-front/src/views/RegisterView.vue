<template>
  <div class="container">
    <h1>Créer un compte</h1>

    <form @submit.prevent="handleRegister" novalidate>
      <input v-model.trim="username" type="text" placeholder="Username" required />
      <input v-model.trim="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="passwordConfirm" type="password" placeholder="Confirm password" required />
      <input v-model.trim="bio" type="text" placeholder="Bio" required />
      <input v-model.trim="city" type="text" placeholder="Ville" required/>

      <button type="submit">Créer un compte</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p>
      Vous avez déjà un compte ?
      <router-link to="/login">Se connecter</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '@/services/auth.service';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const bio = ref('');
const city = ref('');
const error = ref('');

const router = useRouter();

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isStrongPassword(value) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(value);
}

function validateForm() {
  error.value = '';

  if (!username.value) {
    error.value = 'Veuillez renseigner un pseudo.';
    return false;
  }

  if (username.value.length < 3) {
    error.value = 'Le pseudo doit au moins faire 3 caractères.';
    return false;
  }

  if (username.value.length > 32) {
    error.value = 'Le pseudo ne doit pas dépasser 32 caractères.';
    return false;
  }

  if (!email.value) {
    error.value = 'Veuillez renseigner un email.';
    return false;
  }

  if (!isValidEmail(email.value)) {
    error.value = 'Format de mail invalide.';
    return false;
  }

  if (!password.value) {
    error.value = 'Password is required.';
    return false;
  }

  if (!isStrongPassword(password.value)) {
    error.value =
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
    return false;
  }

  if (!passwordConfirm.value) {
    error.value = 'Veuilez remplir le champs de confirmation du mot de passe.';
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    error.value = 'Les mots de passe ne correspondent pas.';
    return false;
  }

  if (!bio.value) {
    error.value = 'Veuillez renseigner une bio.';
    return false;
  }

  if (bio.value.length < 3) {
    error.value = 'La bio doit contenir au moins 3 caractères.';
    return false;
  }

  if (bio.value.length > 100) {
    error.value = 'La bio ne doit pas dépasser 100 caractères.';
    return false;
  }

  if (!city.value) {
    error.value = 'Veuillez renseigner la ville.';
    return false;
  }

  if (city.value.length < 1) {
    error.value = 'La ville doit contenir au moins 1 caractère.';
    return false;
  }

  if (city.value.length > 32) {
    error.value = 'La ville ne doit pas dépasser 32 caractères.';
    return false;
  }

  return true;
}

async function handleRegister() {
  try {

    if (!validateForm()) {
      return;
    }

    const res = await register({
      username: username.value,
      email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      bio: bio.value,
      city: city.value
    });

    if (!res.success) {
      throw new Error('Register failed');
    }

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.data));

    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'Register failed';
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