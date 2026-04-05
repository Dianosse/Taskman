<template>
  <div class="container">
    <h1>Register</h1>

    <form @submit.prevent="handleRegister" novalidate>
      <input v-model.trim="username" type="text" placeholder="Username" required />
      <input v-model.trim="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="passwordConfirm" type="password" placeholder="Confirm password" required />
      <input v-model.trim="bio" type="text" placeholder="Bio" required />

      <button type="submit">Register</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <p>
      Already have an account ?
      <router-link to="/login">Login</router-link>
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
    error.value = 'Username is required.';
    return false;
  }

  if (username.value.length < 3) {
    error.value = 'Username must contain at least 3 characters.';
    return false;
  }

  if (username.value.length > 32) {
    error.value = 'Username must not exceed 32 characters.';
    return false;
  }

  if (!email.value) {
    error.value = 'Email is required.';
    return false;
  }

  if (!isValidEmail(email.value)) {
    error.value = 'Invalid email format.';
    return false;
  }

  if (!password.value) {
    error.value = 'Password is required.';
    return false;
  }

  if (!isStrongPassword(password.value)) {
    error.value =
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.';
    return false;
  }

  if (!passwordConfirm.value) {
    error.value = 'Password confirmation is required.';
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    error.value = 'Passwords do not match.';
    return false;
  }

  if (!bio.value) {
    error.value = 'Bio is required.';
    return false;
  }

  if (bio.value.length < 3) {
    error.value = 'Bio must contain at least 3 characters.';
    return false;
  }

  if (bio.value.length > 100) {
    error.value = 'Bio must not exceed 100 characters.';
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
      bio: bio.value
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