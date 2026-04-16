<template>
  <div>
    <Navbar />

    <main class="edit-profile-page">
      <section class="edit-card">
        <h1>Modifier mon profil</h1>

        <div v-if="loading" class="state-message">
          Chargement...
        </div>

        <div v-else>
          <form @submit.prevent="handleSubmit" class="form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                  id="email"
                  v-model.trim="email"
                  type="email"
                  placeholder="Votre email"
                  required
              />
            </div>

            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input
                  id="username"
                  v-model.trim="username"
                  type="text"
                  placeholder="Votre nom d'utilisateur"
                  required
              />
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                  id="bio"
                  v-model.trim="bio"
                  placeholder="Parlez un peu de vous"
                  rows="5"
                  required
              />
            </div>

            <p v-if="successMessage" class="success-message">
              {{ successMessage }}
            </p>

            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>

            <div class="actions">
              <router-link to="/profile" class="secondary-btn">
                Annuler
              </router-link>

              <button type="submit" class="primary-btn" :disabled="saving">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getMyProfile, updateMyProfile } from '@/services/users.service'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)

const userId = ref(null)
const email = ref('')
const username = ref('')
const bio = ref('')

const successMessage = ref('')
const errorMessage = ref('')

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

function validateForm() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value) {
    errorMessage.value = "L'email est requis."
    return false
  }

  if (!isValidEmail(email.value)) {
    errorMessage.value = "Le format de l'email est invalide."
    return false
  }

  if (!username.value) {
    errorMessage.value = "Le nom d'utilisateur est requis."
    return false
  }

  if (username.value.length < 3) {
    errorMessage.value = "Le nom d'utilisateur doit contenir au moins 3 caractères."
    return false
  }

  if (username.value.length > 32) {
    errorMessage.value = "Le nom d'utilisateur ne doit pas dépasser 32 caractères."
    return false
  }

  if (!bio.value) {
    errorMessage.value = "La bio est requise."
    return false
  }

  if (bio.value.length > 100) {
    errorMessage.value = "La bio ne doit pas dépasser 100 caractères."
    return false
  }

  return true
}

async function fetchProfile() {
  try {
    const res = await getMyProfile()

    if (!res.success) {
      throw new Error("Impossible de récupérer le profil")
    }

    userId.value = res.data.id
    email.value = res.data.email
    username.value = res.data.username
    bio.value = res.data.bio || ''
  } catch (err) {
    errorMessage.value =
        err.response?.data?.error || err.message || "Une erreur est survenue"
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    if (!validateForm()) {
      return
    }

    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const res = await updateMyProfile(userId.value, {
      email: email.value,
      username: username.value,
      bio: bio.value
    })

    if (!res.success) {
      throw new Error("Impossible de modifier le profil")
    }

    localStorage.setItem('user', JSON.stringify(res.data))

    successMessage.value = 'Profil mis à jour avec succès.'

    setTimeout(() => {
      router.push('/profile')
    }, 800)
  } catch (err) {
    errorMessage.value =
        err.response?.data?.error || err.message || "Une erreur est survenue"
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.edit-profile-page {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px 40px;
}

.edit-card {
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 28px;
  background: white;
}

.edit-card h1 {
  margin-top: 0;
  margin-bottom: 24px;
}

.state-message {
  text-align: center;
  font-size: 18px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font: inherit;
}

.form-group textarea {
  resize: vertical;
}

.success-message {
  color: green;
  font-weight: 600;
  margin: 0;
}

.error-message {
  color: red;
  font-weight: 600;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
}

.secondary-btn {
  padding: 12px 16px;
  border: 1px solid #111;
  border-radius: 8px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
}

.primary-btn {
  padding: 12px 18px;
  background: darkorange;
  color: darkblue;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.primary-btn:hover {
  background: darkblue;
  color: darkorange;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>